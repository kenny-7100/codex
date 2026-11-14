# 持续等待模型供应商恢复

适用：个人分支 `codexx` 与 Apple Silicon macOS 定制插件。核实日期：2026-11-14。
持续恢复功能已完成，Rust 回归、原生故障矩阵、真实 VS Code 和定制 VSIX 归档检查均通过。
背景与原机制见 [网络故障恢复](vscode-network-recovery.md)，引擎安装方式见
[引擎开发与交付](vscode-engine-development.md)。

## 行为与边界

用户确认：网络与模型供应商可能长时间不可用，但通常能够恢复。先保留现有快速重试、
网络连接持续重试与 WebSocket → HTTPS 回退；原本将结束的远程请求故障改为长期等待。
长期退避依次为 15、30、60、120、240、300 秒，之后保持 300 秒，不设尝试次数上限。
计数器饱和而不溢出；短于本地退避或已经过期的 Retry-After 不会导致忙循环。
服务端较长的等待建议和 HTTP 内层退避也受 300 秒上限约束。
上限指等待时间，一次请求自身的连接、响应和断流判定耗时另计。

恢复继续当前轮次的请求循环，不自动发送新的“继续”消息。已完成工具操作仍由原有历史
与执行记录管理；不承诺远端请求 exactly-once。错误和重试提示沿现有 StreamError 通知
展示，不作为用户消息写进模型上下文。用户停止、取消、退出进程仍可结束等待。

覆盖目标是模型采样和阻塞当前任务的压缩请求。Cloudflare 403/HTML、401、连接失败、
服务端 5xx、超时、断流和重试耗尽都进入远程故障恢复。认证或配置类远程拒绝也可能需要
用户修正条件才能恢复；持续等待不会绕过 Cloudflare 或认证检查。
本地执行与沙箱权限错误、用户取消、上下文修复、预算限制和明确内容策略保留原有语义。
进程退出、系统关机与崩溃后的恢复不属于本次承诺。
后台预压缩保留现有可放弃优化路径；需要阻塞等待时由前台压缩负责恢复。

## 代码入口与开关

- [共享状态机](../../codex-rs/core/src/responses_retry.rs)：远程错误分类、长期退避、通知与等待。
- [采样出口](../../codex-rs/core/src/session/turn.rs)：避免 UsageLimitReached 提前绕过恢复处理。
- [传统压缩循环](../../codex-rs/core/src/compact.rs)：保留上下文超限时删减历史的处理。
- [HTTP 重试](../../codex-rs/codex-client/src/retry.rs) 与
  [Provider 配置](../../codex-rs/codex-client/src/provider.rs)：可选的 max_delay，默认保持原行为。
- [ModelClient](../../codex-rs/core/src/client.rs) 从会话配置接入 HTTP 等待上限。

引擎开关为 `features.persistent_provider_retries=true`，默认关闭以保留原 CLI 行为。
内置定制引擎的插件构建通过清单标记识别支持能力，启动时读取
`chatgpt.persistentProviderRetries`（默认开启）。关闭后重载窗口可回退原重试策略。
未嵌入定制引擎时不向参考二进制注入新开关。

## 磁盘与构建隔离

初始系统盘仅约 6.5 GiB 可用，移动硬盘约 313 GiB 可用；`~/kenny` 指向 `/Volumes/kenny`。
使用独立的新环境，不迁移或清理原 `~/.cargo`、`~/.rustup` 和用户数据：

```text
/Volumes/kenny/codex-build/
├── rustup/             Rust 1.99.1 与必要组件
├── cargo/              新的 registry 与 Git 依赖
├── target/             编译和测试产物
├── tmp/                构建临时文件及隔离验收数据
├── baseline-source/    修改前提交的源码快照
└── artifacts/          后续用于固定验收与打包的引擎副本
```

[外置构建入口](../../vscode-extension/scripts/engine.sh) 设置 RUSTUP_HOME、CARGO_HOME、
CARGO_TARGET_DIR、TMPDIR，关闭增量构建并默认使用 4 个构建任务。没有更改全局默认工具链。
`CODEXX_BUILD_ROOT` 可指定其他已有磁盘下的构建目录。

```sh
sh vscode-extension/scripts/engine.sh setup
sh vscode-extension/scripts/engine.sh build
sh vscode-extension/scripts/engine.sh test
# test/validate 自动将本机端口加入 NO_PROXY，避免代理将连接拒绝变成 502。
sh vscode-extension/scripts/engine.sh validate
```

基线快照和当前源码若共用 target，修改时间早于基线构建的文件可能被 Cargo 当成缓存命中；
本次出现过旧 feature 注册模块被复用，已通过刷新所有修改过 Rust 文件的时间戳强制重新编译。
后续跨快照验收优先隔离 target，或明确使变更模块失效；打包还会实际探测二进制的新开关。

当前使用仓库已有 `dev-small` profile（无调试符号、无优化）验证功能与降低占用；
不能把它描述为已经过性能验收的 release 构建。

## 打包与回退

[定制引擎装配](../../vscode-extension/scripts/custom-engine.mjs) 从忽略的本机描述文件
`vscode-extension/resources/custom-engine.json` 或 `CODEXX_ENGINE` 获取输入。
描述文件可固定绝对路径、SHA-256、sourceRevision 和 sourceDiffSha256。
构建核对摘要，探测新功能标志，检查 macOS 签名，将引擎复制到可写构建目录，
写入插件清单与构建报告。不会写参考原件，也不把二进制纳入 Git。

```json
{
  "path": "/Volumes/kenny/codex-build/artifacts/codex-persistent-recovery",
  "sha256": "填写已验收二进制的真实 SHA-256",
  "sourceRevision": "填写源码提交",
  "sourceDiffSha256": "若从未提交改动构建，填写对应 diff 摘要"
}
```

随后在 `vscode-extension/` 运行 build、package、verify -- --allow-changes。
输出 VSIX 包内含引擎；最终用户无需 Rust，也不依赖开发机移动硬盘路径。
恢复官方引擎时移开本机描述文件并清除 CODEXX_ENGINE，重新构建打包。
只关闭持续重试可使用插件设置，无需替换二进制。

## 验收入口

- [Rust 虚拟时间测试](../../codex-rs/core/src/responses_retry_tests.rs)：退避、上限、取消、开关和原策略回归。
- [原生协议故障注入](../../vscode-extension/test/engine/recovery-acceptance.py)：真实 app-server、临时 CODEX_HOME、本机 HTTP/SSE 服务，检查恢复、同一轮次、上下文隔离和停止。
- [真实 VS Code 集成](../../vscode-extension/test/engine/vscode-recovery.mjs)：独立 VS Code 与 CODEX_HOME，真实 Webview 消息桥和停止按钮。
- 插件原有 `npm test`、`npm run test:ui` 继续验证聊天管理定制。

原生验收的 `--baseline` 模式用于确认正常请求成功及未启用策略时 403 会失败。
所有模型请求只访问本机模拟服务，不使用真实供应商、账号或凭据。
详细运行报告保留本机 reports/，不提交原始日志或用户数据。

## 已验证行为

- 未修改源码基线：`dev-small` 构建成功，CLI 版本为仓库开发版本 `0.0.0`；原生初始化、正常模型请求、会话改名与回读通过，403 按旧策略直接失败。
- 定制引擎：19 个真实 app-server 场景通过，覆盖连接拒绝后恢复、401、429、配额与用量限制、连续 403、Cloudflare HTML、502/503、连接断开、200 HTML、SSE 不完整、流空闲超时、已完成工具不重放、主动停止、WebSocket 回退及压缩恢复/取消。
- 连续 403 实测请求间隔约 15.01 与 30.02 秒；工具恢复场景只有一次 commandExecution 完成事件。
- 真实 VS Code：定制引擎与原 Webview 消息桥工作，显示恢复提示、同轮次恢复回答，实际点击停止后约 111 ms 收到中断完成事件。
- Rust 核心重试 9 项（含原有 2 项）、feature 47 项、API 单元与集成 235 项通过；虚拟时间验证五分钟上限、短 Retry-After 下限与取消，计数饱和后重复 1,000 次仍可重试。
- 与参考包继续复用的 codex-code-mode-host 通过 2 项当前 Rust gRPC 客户端测试：会话隔离/共享进程、执行和关闭，以及 stdin EOF 退出。
- 插件逻辑 10 项与聊天管理界面 5 项回归已通过。
- 独立 VS Code 扩展目录安装 VSIX 成功；安装后的引擎摘要与清单一致、执行权限正常、签名检查通过，新功能标志可用，插件设置默认为开启。
- 定制 VSIX：修改 5 个原条目（扩展清单、宿主、引擎、两个已有 Webview 模块），新增 4 个聊天管理模块，无删除；其余原条目内容相同，CRC 有效。

详细结果保存在本机 `vscode-extension/reports/engine-recovery.json`、`vscode-recovery.json`、
`vsix-installation.json` 及对应 Rust 测试日志。
上述验证使用本地模拟服务，没有真实断开用户网络或向模型供应商发送测试请求。

## 当前本地产物

- 引擎：`/Volumes/kenny/codex-build/artifacts/codex-persistent-recovery`，SHA-256 为 `ed3fde6d0e57b48e3887c15667c6754721ce725cbd3e8f620d899f9d6da6116c`，macOS 签名检查通过。
- VSIX：`vscode-extension/dist/openai.chatgpt-26.51111.21308-darwin-arm64-reconstructed.vsix`，SHA-256 为 `858a8ccb5badf1e61dd0dee92239a8b7707718c8d08b7fd88366535fcd878da3`。
- 原始参考 VSIX 仍为 `6cbfc1bba9237e9d3287ab18f246041c0746b19b1c5cbf674a04b74849f840ae`。
- 当前引擎从父提交 `a6f59f4adcf5e0a94fe0814399e7a44028693455` 加本次 Rust 改动构建，`git diff --binary -- codex-rs` 的 SHA-256 为 `2c95a2eb75af2c3cb53968ec0fe5a9cff1a5f69668917ca0fb22ff53bb929c90`；插件清单记录同一来源与摘要。

本次新增构建环境约占移动硬盘 17 GiB，其中 target 约 10 GiB、Cargo 缓存约 4.7 GiB；
结束检查时移动硬盘尚余约 293 GiB，系统盘约 4.5 GiB。系统 swap 会随构建和其他应用变化；
没有清理用户文件、原 Rust 环境或全局缓存，也没有修改系统 swap 配置。
本地交付为 `dev-small` 开发构建；未做优化 release 性能验收或逐一重测整个上游工作区。
