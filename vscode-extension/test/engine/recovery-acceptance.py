#!/usr/bin/env python3
"""Real app-server + local HTTP fault injection. No credentials or external model requests."""
import argparse
import collections
import http.server
import json
import os
import pathlib
import queue
import subprocess
import sys
import tempfile
import threading
import time


class ModelServer:
    def __init__(self, faults):
        self.faults = collections.deque(faults)
        self.requests = []
        self.request_times = []
        self.websocket_attempts = 0
        self.lock = threading.Lock()
        owner = self

        class Handler(http.server.BaseHTTPRequestHandler):
            def log_message(self, *args):
                pass

            def do_GET(self):
                with owner.lock:
                    owner.websocket_attempts += 1
                self.send_response(403)
                self.send_header("Content-Type", "text/html")
                self.end_headers()
                self.wfile.write(b"<html>Cloudflare challenge</html>")

            def do_POST(self):
                body = self.rfile.read(int(self.headers.get("Content-Length", "0")))
                try:
                    payload = json.loads(body)
                except ValueError:
                    payload = {"unparsed": True}
                with owner.lock:
                    owner.requests.append(payload)
                    owner.request_times.append(time.monotonic())
                    fault = owner.faults.popleft() if owner.faults else None
                if fault == "tool":
                    self.respond_sse(
                        [
                            {
                                "id": "fc_once",
                                "type": "function_call",
                                "name": "exec_command",
                                "call_id": "call_once",
                                "arguments": json.dumps(
                                    {
                                        "cmd": "printf codexx-once",
                                        "max_output_tokens": 100,
                                    }
                                ),
                            }
                        ]
                    )
                    return
                if fault in ("stream", "timeout"):
                    self.send_response(200)
                    self.send_header("Content-Type", "text/event-stream")
                    self.end_headers()
                    self.wfile.write(
                        b'event: response.created\ndata: {"type":"response.created","response":{"id":"resp_interrupted"}}\n\n'
                    )
                    self.wfile.flush()
                    if fault == "timeout":
                        time.sleep(2)
                    return
                if fault:
                    if fault == "drop":
                        self.connection.close()
                        return
                    status = (
                        200
                        if fault == "html200"
                        else 429 if fault in ("quota", "usage_limit") else int(fault)
                    )
                    data = (
                        b"<html><title>Just a moment...</title>Cloudflare challenge</html>"
                        if status in (200, 403)
                        else b'{"error":{"message":"temporary provider outage","type":"server_error"}}'
                    )
                    if fault in ("quota", "usage_limit"):
                        kind = (
                            "insufficient_quota"
                            if fault == "quota"
                            else "usage_limit_reached"
                        )
                        data = json.dumps(
                            {
                                "error": {
                                    "message": "temporary provider limit",
                                    "type": kind,
                                    "code": kind,
                                }
                            }
                        ).encode()
                    self.send_response(status)
                    self.send_header(
                        "Content-Type",
                        "text/html" if status in (200, 403) else "application/json",
                    )
                    self.send_header("Content-Length", str(len(data)))
                    self.end_headers()
                    self.wfile.write(data)
                    return
                message = {
                    "id": "msg_recovered",
                    "type": "message",
                    "role": "assistant",
                    "status": "completed",
                    "content": [
                        {"type": "output_text", "text": "Recovered successfully."}
                    ],
                }
                self.respond_sse([message])

            def respond_sse(self, output):
                events = [
                    ("response.created", {"response": {"id": "resp_recovered"}}),
                    (
                        "response.output_item.done",
                        {"item": output[0], "output_index": 0},
                    ),
                    (
                        "response.completed",
                        {
                            "response": {
                                "id": "resp_recovered",
                                "status": "completed",
                                "output": output,
                                "usage": {
                                    "input_tokens": 1,
                                    "output_tokens": 1,
                                    "total_tokens": 2,
                                },
                            }
                        },
                    ),
                ]
                data = "".join(
                    "event: "
                    + kind
                    + "\ndata: "
                    + json.dumps({"type": kind, **value})
                    + "\n\n"
                    for kind, value in events
                ).encode()
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)

        self.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.start_timer = None
        if self.faults and self.faults[0] == "refused":
            self.faults.popleft()
            port = self.server.server_port
            self.server.server_close()

            def restore():
                self.server = http.server.ThreadingHTTPServer(
                    ("127.0.0.1", port), Handler
                )
                threading.Thread(target=self.server.serve_forever, daemon=True).start()

            self.start_timer = threading.Timer(2, restore)
            self.start_timer.start()
        else:
            threading.Thread(target=self.server.serve_forever, daemon=True).start()

    @property
    def url(self):
        return "http://127.0.0.1:%d/v1" % self.server.server_port

    def close(self):
        if self.start_timer:
            self.start_timer.join()
        self.server.shutdown()
        self.server.server_close()


class AppServer:
    def __init__(self, binary, home, url, persistent, websocket=False):
        self.events = []
        self.inbox = queue.Queue()
        self.serial = 0
        config = {
            "model_provider": "probe",
            "model": "gpt-5.1-codex",
            "model_providers": {
                "probe": {
                    "name": "Fault injection",
                    "base_url": url,
                    "wire_api": "responses",
                    "requires_openai_auth": False,
                    "supports_websockets": websocket,
                    "request_max_retries": 0,
                    "stream_max_retries": 0,
                    "stream_idle_timeout_ms": 1500,
                }
            },
            "features": {"unbounded_connection_retries": False},
        }
        # TOML explicit serialization keeps all state in this disposable home.
        text = 'model_provider="probe"\nmodel="gpt-5.1-codex"\n[features]\nunbounded_connection_retries=false\n'
        if persistent:
            text += "persistent_provider_retries=true\n"
        text += "[model_providers.probe]\n" + "".join(
            k + "=" + json.dumps(v) + "\n"
            for k, v in config["model_providers"]["probe"].items()
        )
        pathlib.Path(home, "config.toml").write_text(text)
        env = {k: v for k, v in os.environ.items() if "proxy" not in k.lower()}
        env.update(CODEX_HOME=home, NO_PROXY="127.0.0.1,localhost")
        self.log = open(pathlib.Path(home, "app-server.log"), "w")
        self.proc = subprocess.Popen(
            [binary, "app-server"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=self.log,
            text=True,
            env=env,
            cwd=home,
        )

        def read():
            for line in self.proc.stdout:
                try:
                    self.inbox.put(json.loads(line))
                except ValueError:
                    pass

        threading.Thread(target=read, daemon=True).start()
        self.rpc(
            "initialize",
            {
                "clientInfo": {"name": "codexx_recovery_acceptance", "version": "1"},
                "capabilities": {"experimentalApi": True},
            },
        )
        self.send({"method": "initialized"})

    def send(self, message):
        self.proc.stdin.write(json.dumps(message) + "\n")
        self.proc.stdin.flush()

    def receive(self, timeout):
        try:
            value = self.inbox.get(timeout=timeout)
        except queue.Empty:
            raise AssertionError("App-server response timed out")
        self.events.append(value)
        return value

    def rpc(self, method, params):
        self.serial += 1
        ident = self.serial
        self.send({"id": ident, "method": method, "params": params})
        end = time.monotonic() + 30
        while time.monotonic() < end:
            message = self.receive(max(0.01, end - time.monotonic()))
            if message.get("id") == ident:
                assert "error" not in message, (method, message.get("error"))
                return message.get("result")
        raise AssertionError("RPC timed out: " + method)

    def wait(self, predicate, timeout=80):
        for message in self.events:
            if predicate(message):
                return message
        end = time.monotonic() + timeout
        while time.monotonic() < end:
            message = self.receive(max(0.01, end - time.monotonic()))
            if predicate(message):
                return message
        raise AssertionError("Expected notification missing")

    def close(self):
        self.proc.terminate()
        try:
            self.proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self.proc.kill()
            self.proc.wait()
        self.log.close()


def run(
    binary, persistent, faults, cancel=False, expect_failure=False, websocket=False
):
    model = ModelServer(faults)
    with tempfile.TemporaryDirectory(
        prefix="engine-recovery-", dir=os.environ.get("TMPDIR")
    ) as home:
        app = AppServer(binary, home, model.url, persistent, websocket)
        try:
            thread = app.rpc(
                "thread/start",
                {
                    "cwd": home,
                    "ephemeral": False,
                    "approvalPolicy": "never",
                    "sandbox": "read-only",
                },
            )["thread"]["id"]
            app.rpc(
                "thread/name/set", {"threadId": thread, "name": "recovery acceptance"}
            )
            assert (
                app.rpc("thread/read", {"threadId": thread, "includeTurns": False})[
                    "thread"
                ]["name"]
                == "recovery acceptance"
            )
            turn = app.rpc(
                "turn/start",
                {
                    "threadId": thread,
                    "input": [
                        {
                            "type": "text",
                            "text": (
                                "Run the requested single command then reply."
                                if "tool" in faults
                                else "Reply once. Do not use tools."
                            ),
                        }
                    ],
                },
            )["turn"]["id"]
            if cancel:
                app.wait(
                    lambda m: m.get("method") == "error"
                    and m["params"].get("willRetry") is True
                )
                started = time.monotonic()
                app.rpc("turn/interrupt", {"threadId": thread, "turnId": turn})
            completed = app.wait(
                lambda m: m.get("method") == "turn/completed", timeout=80
            )
            status = completed["params"]["turn"]["status"]
            assert (
                completed["params"]["turn"]["id"] == turn
            ), "Recovery changed turn identity"
            assert status == (
                "interrupted" if cancel else "failed" if expect_failure else "completed"
            ), completed
            if cancel:
                assert (
                    time.monotonic() - started < 3
                ), "Cancel did not interrupt recovery wait"
            starts = [e for e in app.events if e.get("method") == "turn/started"]
            assert len(starts) == 1, "Recovery must keep the original turn"
            waits = [
                round(right - left, 2)
                for left, right in zip(model.request_times, model.request_times[1:])
            ]
            if persistent and faults and faults[0] == 403 and not cancel:
                assert waits[0] >= 14.5, "Persistent recovery skipped the long backoff"
                if len(faults) > 1:
                    assert (
                        waits[1] >= 29.5
                    ), "Persistent recovery restarted its fast retry budget"
            requests = json.dumps(model.requests)
            assert (
                "Reconnecting..." not in requests
            ), "Retry status leaked into model context"
            assert (
                "Cloudflare challenge" not in requests
            ), "Provider fault leaked into model context"
            result = {
                "faults": faults,
                "status": status,
                "sameTurn": True,
                "requestIntervalsSeconds": waits,
                "requests": len(model.requests),
                "retryEvents": sum(
                    e.get("method") == "error"
                    and e.get("params", {}).get("willRetry") is True
                    for e in app.events
                ),
                "cancel": cancel,
                "websocketAttempts": model.websocket_attempts,
            }
            if websocket:
                assert (
                    model.websocket_attempts > 0
                ), "WebSocket handshake must be exercised"
            if "tool" in faults:
                executions = [
                    e
                    for e in app.events
                    if e.get("method") == "item/completed"
                    and e.get("params", {}).get("item", {}).get("type")
                    == "commandExecution"
                ]
                assert len(executions) == 1, "Completed tool must not be replayed"
                result["completedToolExecutions"] = len(executions)
            assert all(
                not request.get("unparsed") for request in model.requests
            ), "Model requests must be inspectable for context assertions"
            if faults and not cancel and not expect_failure:
                assert len(model.requests) > len(
                    [fault for fault in faults if fault != "refused"]
                )
            print("PASS " + json.dumps(result), file=sys.stderr, flush=True)
            return result
        finally:
            app.close()
            model.close()


def run_compaction(binary, persistent=True, cancel=False):
    model = ModelServer([])
    with tempfile.TemporaryDirectory(
        prefix="compact-recovery-", dir=os.environ.get("TMPDIR")
    ) as home:
        app = AppServer(binary, home, model.url, persistent)
        try:
            thread = app.rpc(
                "thread/start",
                {"cwd": home, "approvalPolicy": "never", "sandbox": "read-only"},
            )["thread"]["id"]
            app.rpc(
                "turn/start",
                {
                    "threadId": thread,
                    "input": [{"type": "text", "text": "Reply once."}],
                },
            )
            app.wait(lambda m: m.get("method") == "turn/completed")
            app.events.clear()
            if persistent:
                model.faults.extend([403] * (50 if cancel else 1))
            app.rpc("thread/compact/start", {"threadId": thread})
            if cancel:
                app.wait(
                    lambda m: m.get("method") == "error"
                    and m["params"].get("willRetry")
                )
                turn = app.wait(lambda m: m.get("method") == "turn/started")["params"][
                    "turn"
                ]["id"]
                started = time.monotonic()
                app.rpc("turn/interrupt", {"threadId": thread, "turnId": turn})
            completed = app.wait(lambda m: m.get("method") == "turn/completed")
            status = completed["params"]["turn"]["status"]
            assert status == ("interrupted" if cancel else "completed"), completed
            if cancel:
                assert time.monotonic() - started < 3
            assert "Reconnecting..." not in json.dumps(model.requests)
            return {
                "compaction": True,
                "cancel": cancel,
                "status": status,
                "requests": len(model.requests),
            }
        finally:
            app.close()
            model.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("binary")
    parser.add_argument("--baseline", action="store_true")
    args = parser.parse_args()
    binary = str(pathlib.Path(args.binary).resolve())
    results = [run(binary, not args.baseline, [])]
    if args.baseline:
        results.append(run(binary, False, [403], expect_failure=True))
    else:
        for faults in [
            ["refused"],
            [401],
            [429],
            ["quota"],
            ["usage_limit"],
            [403, 403],
            [403],
            [502],
            [503],
            ["drop"],
            ["html200"],
            ["stream"],
            ["timeout"],
            ["tool", 403],
        ]:
            results.append(run(binary, True, faults))
        results.append(run(binary, True, [403] * 50, cancel=True))
        results.append(run(binary, True, [403], websocket=True))
        results.append(run_compaction(binary))
        results.append(run_compaction(binary, cancel=True))
    print(
        json.dumps(
            {"passed": True, "baseline": args.baseline, "scenarios": results}, indent=2
        )
    )
