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

## 分支、编辑与旧历史协议兼容（2026-11-16）

适用：官方前端 `26.51111.21308` 与本分支 `0.0.0` 定制引擎组合。
用户报告从较早轮次分支时出现“聊天已创建，但设置未能完成”，错误为
`unknown variant thread/rollback`。根因和修复如下。

### 已验证根因

- 参考包引擎报告 `0.169.0-alpha.11.1`，定制引擎报告 `0.0.0`；隔离原生探测确认
  两者都不支持 `thread/rollback`，都支持原生按轮次截断的 fork。
- 前端 `app-initial-050fbd442c4f.js` 的 `ihe` 在 legacy 历史配合 `0.0.0` 时，
  先 fork 全部历史，再调用已移除的 rollback；第二步失败不会撤销已创建的新聊天。
  先前报错生成的聊天不能视为已经正确截断，本次不自动改写这些已有分支。
- 分页历史支持函数 `xTt`、分页分支菜单判断 `Jwt` 和实际 fork 的 `nve` 检查，
  也单独排除了 `0.0.0`；离线实验配置又默认关闭分页历史。
  编辑消息与缓冲轮次重试因此仍可能选择 rollback。共享能力表 `Gy` 已将开发版本
  视为支持这些原生能力，独立版本判断与它不一致。
- 旧历史另有真实后端限制：`thread/revert` 原先只允许 paginated，会话重启也不会
  默认转换 legacy，因为原生后台迁移开关默认关闭。

### 实现与边界

构建钩子 [`protocol-compat.mjs`](../../vscode-extension/scripts/protocol-compat.mjs)
修正具体历史/分支判断，保留真实引擎版本；开发引擎的普通新聊天使用分页历史，
分支直接发送 `lastTurnId` 或 `beforeTurnId`。保留旧引擎兼容路径，不把所有版本门槛
统一改成一个伪造的官方版本。可读与原始压缩源码均须精确匹配，重复或缺失钩子拒绝构建。

Rust `thread_revert_response` 对本地 legacy 历史支持按需迁移：先完整关闭并排空当前
会话、保留运行配置和订阅，调用已有迁移实现仅转换该 thread ID，再按 `beforeTurnId`
撤回并重载同一会话。复用迁移日志、写锁与原子发布机制，不启动全库迁移，也不撤回文件改动。
无效目标的原生验收确认历史保留；迁移不成功不会执行后续撤回。临时会话仍拒绝撤回。

前端编辑与缓冲重试仅在装配了声明支持该能力的定制引擎时，允许 legacy 走原生 revert，
并接纳响应中的 paginated 模式、路径和分页游标。装配清单的 `legacyThreadRevert: true`
要求本机描述文件同时固定匹配的 SHA-256；不能给未验证的旧二进制直接添加该标记。
`custom-engine.mjs` 将能力标记写入包内清单，最终用户不依赖外置开发路径。

字面量 RPC 审计对照了三个主要前端模块和当前 Rust 方法表。发现的本地废弃请求是
rollback 的三个调用点，分别覆盖历史分支、编辑和缓冲重试；本次均有回归。
`thread/stop` 位于独立 durable/cloud 路径，常规本地停止使用 `turn/interrupt`；
保留其现有回退。部分 `0.0.0` 特例控制时间线、搜索及更新提示，不等同于协议不兼容，
未据此批量开启所有能力。审计不证明全部云端、远程环境和懒加载功能均已验收。

### 复现与验收入口

- `npm test`：提取实际发布函数，覆盖 legacy/paginated 分支、菜单、两种截断边界、
  编辑、缓冲重试、迁移模式接纳、旧/未知版本和压缩源码构建钩子。
- `npm run test:protocol`：使用 build 中实际内置引擎、临时 CODEX_HOME 与本机模型模拟服务，
  检查 legacy/paginated 的两种分支边界、原会话保留、后续模型上下文、无效目标和撤回重发。
- `npm run test:lan`：双真实 VS Code 宿主、浏览器和内置引擎；新增实际点击较早回复的
  “Branch in new chat”、分支内编辑，以及从首页打开已有 legacy 聊天并编辑的验收。
- Rust `thread_revert` 集成回归加入 legacy 参数，沿用已有配置恢复、会话保留和通知断言。

验收创建模拟历史时，`turn/start` 返回只表示已接收请求，不保证历史已写盘；
应等待 `turn/completed` 或历史中对应轮次完成，再改名或断言持久化内容。
局域网首页测试的直接 RPC 夹具显式使用分页历史，与当前产品创建策略一致。

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
- 持续恢复验收时的定制 VSIX（Jimao 品牌定制前）：修改 5 个原条目（扩展清单、宿主、引擎、两个已有 Webview 模块），新增 4 个聊天管理模块，无删除；其余原条目内容相同，CRC 有效。

详细结果保存在本机 `vscode-extension/reports/engine-recovery.json`、`vscode-recovery.json`、
`vsix-installation.json` 及对应 Rust 测试日志。
上述验证使用本地模拟服务，没有真实断开用户网络或向模型供应商发送测试请求。

## 持续恢复完成时的本地产物（Jimao 品牌定制前）

- 引擎：`/Volumes/kenny/codex-build/artifacts/codex-persistent-recovery`，SHA-256 为 `ed3fde6d0e57b48e3887c15667c6754721ce725cbd3e8f620d899f9d6da6116c`，macOS 签名检查通过。
- VSIX：`vscode-extension/dist/openai.chatgpt-26.51111.21308-darwin-arm64-reconstructed.vsix`，SHA-256 为 `858a8ccb5badf1e61dd0dee92239a8b7707718c8d08b7fd88366535fcd878da3`。
- 原始参考 VSIX 仍为 `6cbfc1bba9237e9d3287ab18f246041c0746b19b1c5cbf674a04b74849f840ae`。
- 当前引擎从父提交 `a6f59f4adcf5e0a94fe0814399e7a44028693455` 加本次 Rust 改动构建，`git diff --binary -- codex-rs` 的 SHA-256 为 `2c95a2eb75af2c3cb53968ec0fe5a9cff1a5f69668917ca0fb22ff53bb929c90`；插件清单记录同一来源与摘要。

本次新增构建环境约占移动硬盘 17 GiB，其中 target 约 10 GiB、Cargo 缓存约 4.7 GiB；
结束检查时移动硬盘尚余约 293 GiB，系统盘约 4.5 GiB。系统 swap 会随构建和其他应用变化；
没有清理用户文件、原 Rust 环境或全局缓存，也没有修改系统 swap 配置。
本地交付为 `dev-small` 开发构建；未做优化 release 性能验收或逐一重测整个上游工作区。
