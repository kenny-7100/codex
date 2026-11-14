# VS Code 插件的网络故障恢复

核实日期：2026-11-14。对象：定制工程的 `openai.chatgpt@26.51111.21308` /
`darwin-arm64`，复用原包 app-server 二进制 `0.169.0-alpha.11.1`。
聊天管理定制没有修改远程模型请求的恢复逻辑。

## 两层连接

Webview → VS Code 扩展宿主 → 本机 app-server 使用本机消息与进程管道。
app-server → 远程 LLM endpoint 使用网络。远程模型不可达不等同于本机进程退出。
标签由本机 globalState 保存，历史列表和改名调用本机 app-server，不依赖一次成功的模型推理。
本机 app-server 若异常退出，宿主会失败 pending 请求并广播 fatal error；恢复入口
`codex-app-server-restart` 执行 `workbench.action.reloadWindow`，不是模型断网重试循环。

## 远程模型恢复策略

仓库源码解释路径；本节持续重连分支另外经过当前包内二进制验证，不能把整个仓库 HEAD
视为与此二进制完全对应。

- 普通用户会话的模型采样请求，如果分类为 `ConnectionFailed`，默认开启
  `features.unbounded_connection_retries`。等待间隔按 5、10、20、40、60 秒增长，之后每次 60 秒。
  请求本身的连接时间额外计算。界面显示 `Reconnecting... waiting for network`，恢复后重试当前轮次。
- 该分支不覆盖所有错误：内部会话、Amazon Bedrock 和非采样操作有排除条件。
  网关能返回 HTTP 502/503、请求超时、流中断等可能进入另一条有界重试路径，不能都称为“断网无限重试”。
- 有界路径采用退避与抖动；服务端 Retry-After 可以控制等待时刻。公开配置文档和当前源码
  默认 HTTP 重试参数为 4、流重连参数为 5，流空闲超时为 300000ms（5 分钟）。
  两层重试及传输回退不能简单相加成总请求次数，空闲超时也不是整个任务的最长时间。
- 使用 WebSocket 的会话可在符合条件时回退 HTTPS；这是同一 provider 的传输回退，未实现自动换 LLM endpoint/provider 的故障转移。
- 重试预算耗尽或遇到终止错误时，轮次可标为 failed。之后通常需要修复问题并在原对话中继续；
  不能把已终止轮次理解为必然会在网络恢复后自动复活。
- 已写文件、已执行的工具操作不会因模型网络失败自动回滚；重连也不提供逐 token 断点续传或远端请求 exactly-once 的保证。

## 重试提示是否进入模型上下文

仓库代码中 `Session::notify_stream_error` 发送 `EventMsg::StreamError`，并未将重连提示
追加为普通模型输入；Webview 根据 willRetry 显示重连状态。运行日志与模型上下文分离，
重试次数增加不等于增加同等数量的对话消息。工具输出或用户消息若包含网络错误，则仍会作为正常内容进入上下文。

[rollout 持久化策略](../../codex-rs/rollout/src/policy.rs) 将 StreamError 与独立 Error 事件归为
临时、非持久化事件；最终轮次状态与错误可能由 TurnComplete 等结构另行保留。
不能承诺重新打开聊天还能看到每次重试提示，也不能据此断言本机完全没有故障记录。
重试可能重发既有上下文，不提供远端用量为零或请求 exactly-once 的保证。

这部分依据当前源码与发布界面分支检查，未对原生包做逐字段请求捕获验证。
用户期望进一步覆盖所有可恢复访问错误的持续重试，具体需求与实施条件见
[Rust 引擎开发与交付](vscode-engine-development.md)，该改造尚未实现。

## 当前二进制的隔离验证

使用临时 CODEX_HOME、临时工作目录、`exec --ephemeral --sandbox read-only --json`，
模型 provider 指向本机临时端口；不使用真实 API key，不启动模型工具调用。
清除子进程的代理环境并配置 localhost NO_PROXY，避免本机代理将连接拒绝转换成 HTTP 502。
不修改用户配置、真实 endpoint 或网络状态。

| 场景 | 观测 |
| --- | --- |
| 默认功能开关，request/stream 参数均设为 1，端口拒绝连接 | 日志依次显示 retry_delay=5s、10s；9 秒时仍等待网络，测试主动终止进程 |
| 相同配置，额外设 unbounded_connection_retries=false | 显示 Reconnecting... 1/1，随后 turn.failed，退出码 1 |
| 先拒绝连接，2 秒后启动本机模拟 Responses SSE 服务 | 先出现 waiting for network，随后同一进程收到 turn.completed，退出码 0；没有人工重发 |

第三项只验证连接恢复与请求完成机制，模拟服务返回空输出，不证明真实模型能逐 token 续传。

## 证据入口

- [重连状态事件的产生](../../codex-rs/core/src/session/mod.rs)：notify_stream_error。
- [重连分支与传输回退](../../codex-rs/core/src/responses_retry.rs)
- [默认开关](../../codex-rs/features/src/lib.rs)：UnboundedConnectionRetries 默认 true。
- [provider 默认参数](../../codex-rs/model-provider-info/src/lib.rs)
- [错误分类](../../codex-rs/protocol/src/error.rs) 与 [传输错误映射](../../codex-rs/codex-api/src/api_bridge.rs)
- [发布插件的错误呈现](../../vscode-extension/overrides/webview/assets/app-initial-17dd08407f00.js)：willRetry 区分 stream-error / system-error。
- [宿主进程消息与重启入口](../../vscode-extension/src/extension-host/051-webview-messaging.js)
- [官方配置参考](https://developers.openai.com/codex/config-reference/)
