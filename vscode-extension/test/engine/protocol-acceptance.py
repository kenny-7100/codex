"""Native boundary/revert checks using disposable homes and a loopback model."""
import importlib.util
import json
import pathlib
import sys
import tempfile

spec = importlib.util.spec_from_file_location(
    "recovery", pathlib.Path(__file__).with_name("recovery-acceptance.py")
)
recovery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(recovery)


def run(binary):
    binary = str(pathlib.Path(binary).resolve())
    model = recovery.ModelServer([])
    results = []
    try:
        for mode in ("legacy", "paginated"):
            with tempfile.TemporaryDirectory(prefix="jimao-protocol-") as home:
                app = recovery.AppServer(binary, home, model.url, True)
                try:
                    source = app.rpc("thread/start", {
                        "cwd": home, "historyMode": mode,
                        "approvalPolicy": "never", "sandbox": "read-only",
                    })["thread"]["id"]

                    def turn(thread, text):
                        ident = app.rpc("turn/start", {"threadId": thread, "input": [{"type": "text", "text": text}]})["turn"]["id"]
                        done = app.wait(lambda m: m.get("method") == "turn/completed" and m["params"]["turn"]["id"] == ident)
                        assert done["params"]["turn"]["status"] == "completed", done
                        return ident

                    first = turn(source, "native-first-kept")
                    second = turn(source, "native-second-excluded")

                    def history(thread):
                        info = app.rpc("thread/read", {"threadId": thread})["thread"]
                        if info["historyMode"] == "paginated":
                            return app.rpc("thread/turns/list", {"threadId": thread, "limit": 100, "sortDirection": "asc", "itemsView": "full"})["data"]
                        return app.rpc("thread/read", {"threadId": thread, "includeTurns": True})["thread"]["turns"]

                    for boundary, target in (("lastTurnId", first), ("beforeTurnId", second)):
                        fork = app.rpc("thread/fork", {"threadId": source, boundary: target})["thread"]["id"]
                        assert len(history(fork)) == 1, (mode, boundary, history(fork))
                        assert len(history(source)) == 2
                        turn(fork, "native-fork-followup")
                        request = json.dumps(model.requests[-1])
                        assert "native-first-kept" in request
                        assert "native-second-excluded" not in request
                        results.append(f"{mode} {boundary}: exact boundary, source intact, model context excludes suffix")

                    try:
                        app.rpc("thread/revert", {"threadId": source, "beforeTurnId": "missing-turn"})
                        raise AssertionError("invalid boundary unexpectedly succeeded")
                    except AssertionError as error:
                        assert "thread/revert" in str(error), error
                    assert len(history(source)) == 2, "invalid revert must retain both turns"
                    reverted = app.rpc("thread/revert", {"threadId": source, "beforeTurnId": second})
                    assert reverted["thread"]["turns"] == []
                    assert len(history(source)) == 1
                    turn(source, "native-edited-second")
                    final = history(source)
                    assert len(final) == 2
                    assert "native-edited-second" in json.dumps(final)
                    assert "native-second-excluded" not in json.dumps(final)
                    results.append(f"{mode}: revert and edited resend preserve identity and replace suffix")
                finally:
                    app.close()
    finally:
        model.close()
    report = {"passed": True, "checks": results}
    pathlib.Path("reports/protocol-native.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    run(sys.argv[1])
