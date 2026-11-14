# 插件内置 Rust 引擎的开发与交付

核实日期：2026-11-14（Asia/Shanghai）。范围：当前仓库与
`openai.chatgpt@26.51111.21308` / `darwin-arm64` 的定制工程。
本页保留实施前调查与建议路线；当前构建、持续恢复改动及验收进展以
[持续恢复实现与验收](vscode-persistent-recovery.md) 为准。

## 职责与修改位置

调用链：插件 Webview → JavaScript 扩展宿主 → 本机 `codex app-server` → 远程模型 endpoint。
Rust app-server 决定模型请求是否重试、等待多久、是否结束当前轮次；插件负责展示状态和提供操作入口。
仅在插件层失败后自动发送“继续”会创建新的轮次，不能等同于原轮次保持等待，存在重复执行与状态衔接风险。

主要源码入口：

- [统一重试与传输回退](../../codex-rs/core/src/responses_retry.rs)。
- [模型采样循环及提前终止分支](../../codex-rs/core/src/session/turn.rs)：部分错误在进入统一重试函数前返回；必须一并检查。
- [远程压缩调用](../../codex-rs/core/src/compact_remote_v2.rs)：同样使用共享重试处理器，实施时明确覆盖范围。
- [错误分类](../../codex-rs/protocol/src/error.rs) 与 [传输错误映射](../../codex-rs/codex-api/src/api_bridge.rs)。
- [现有重试测试](../../codex-rs/core/src/responses_retry_tests.rs)：使用 Tokio 虚拟时间，可验证长等待而无需实际等待数小时。

已有恢复机制与二进制隔离验证见 [网络故障恢复](vscode-network-recovery.md)。
仓库 HEAD 与官方包内引擎 `0.169.0-alpha.11.1` 尚未确认来自相同提交，不能从接口同名推定完全兼容。

## 实施前确认的持续恢复需求

用户网络与供应商不稳定，多数故障可恢复。期望保留现有快速重试与传输回退；
在原策略准备结束时进入更长间隔的持续恢复，不设次数上限，等待间隔最多 5 分钟。
范围包括目前直接终止的远程访问错误，例如 Cloudflare 403、HTML 拦截页、异常响应，以及重试耗尽。

- 网络或模型请求故障不能自行放弃当前任务；用户主动停止、取消仍需生效。
- 恢复后在同一轮次继续，不重新发送一条用户消息，不从头重跑已完成的工具操作。
- 5 分钟是两次尝试间等待上限，不含一次请求的连接与响应耗时；实现时统一审查 Retry-After 与多层重试的交互。
- 15、30、60、120、240、300 秒是讨论过的候选长期退避序列，尚非已实现或最终固定的算法。
- 状态应与模型上下文分开；重试不绕过 Cloudflare 验证，也不保证远端 exactly-once。
- 崩溃、关机后的任务恢复属于另一能力，不能用进程内持续重试承诺覆盖。

## 实施前 Mac 环境快照

以下是 2026-11-14 的环境快照，后续开发前重新检查，不视为永久配置。

| 项目 | 实测情况 | 判断 |
| --- | --- | --- |
| 本机架构 | `arm64` / Apple Silicon | 可以原生构建当前 macOS ARM64 插件引擎 |
| 默认 Rust / Cargo | 1.90.0 | 已有工具，但不符合仓库指定版本 |
| rustup | 已安装；工具链包含 1.88.0、1.90.0、nightly 和 Solana 专用工具链 | 可以并存安装所需版本，无需更改全局默认版本 |
| 仓库工具链 | Rust 1.99.1，组件 clippy、rustfmt、rust-src | 由 rust-toolchain.toml 指定；本机尚未安装 |
| Apple 编译工具 | Xcode、macOS SDK 26.2、Apple Clang 17.0.0 | 原生编译与链接基础存在 |
| 辅助工具 | CMake、pkg-config、just 可用 | 已具备常用构建工具；完整依赖仍需由首次构建验证 |
| 项目磁盘 | 可用约 313 GiB | 有空间进行首次构建；不据此保证所有构建模式的占用 |
| Cargo 缓存 | registry 约 1.1 GiB，Git 依赖约 20 MiB | 有缓存，不代表当前项目依赖已齐全 |
| 项目构建产物 | 没有 codex-rs/target 目录 | 尚未完成当前源码的本机首次构建验证 |

检查命令包括 `rustup toolchain list`、`rustc --version`、`cargo --version`、`uname -m`、
`xcode-select -p`、`xcrun --sdk macosx --show-sdk-version`、`xcrun clang --version` 和 `df -h .`。
官方 `https://static.rust-lang.org/dist/channel-rust-1.99.1.toml` 在核查时返回 HTTP 200；
只证明清单可访问，未安装工具链或验证全部组件下载。

[仓库工具链文件](../../codex-rs/rust-toolchain.toml) 供 rustup 在该目录下选择版本，
[Cargo workspace](../../codex-rs/Cargo.toml) 使用 Rust edition 2024。
后续建议先安装指定工具链，再执行未修改基线构建及相关测试；这些步骤本次未执行。
设备具备开发基础，不等于已有可直接交付的新引擎。

## 引擎如何安装到用户设备

官方插件已内置原生可执行文件，当前平台路径为：

```text
extension/
├── out/extension.js
├── webview/
└── bin/macos-aarch64/codex
```

开发者用 Rust/Cargo 编译 `codex`，打包时将产物放入平台对应位置，再生成 VSIX。
用户在 VS Code 选择“从 VSIX 安装”，VS Code 将插件解压到扩展目录；
插件从自己的安装目录启动 `codex app-server` 子进程，经 stdin/stdout 交换消息。
用户无需安装 Rust/Cargo，也不要求将引擎安装为系统服务或 PATH 中的独立 CLI。
常规 VS Code 扩展目录为 `~/.vscode/extensions/`，可因产品版本、远程环境或自定义参数而不同。
当前工程只交付 Apple Silicon macOS 产物；其他系统和架构需要对应引擎及插件包。

程序安装目录与用户数据目录分离。引擎默认使用 `~/.codex`，可由 CODEX_HOME 改写；
标签使用 VS Code 扩展 globalState。替换引擎不等于迁移或清空这些数据。

开发期间可以先通过 [chatgpt.cliExecutable 配置](../../vscode-extension/src/manifest.json)
指向新编译的绝对路径，在独立测试窗口验证，用户最终安装内置新引擎的 VSIX 后无需配置此项。
此设置标注 DEVELOPMENT ONLY，源码也提示自定义引擎可能导致部分扩展功能异常，不能跳过兼容验收。
启动实现见 [宿主进程管理](../../vscode-extension/src/extension-host/048-editor-integration.js)。

当前 [构建脚本](../../vscode-extension/scripts/build.mjs) 默认从参考产物复用引擎。
后续必须为自编译引擎接入可追溯的构建输入，不能只手工替换 build/ 下的文件，否则重建会覆盖。
还需验证执行权限及 macOS 签名与启动；自编译程序不能宣称保有官方原生文件签名。
参考原件始终保留，新引擎与定制包另存。

## 建议实施与验收顺序

1. 安装指定工具链，构建未修改引擎；确认依赖和本机编译可用。
2. 用独立 VS Code 数据目录及 cliExecutable 接入新引擎，验证初始化、历史、开启/取消轮次、通知和改名等协议路径。
3. 修改错误出口和重试状态机，保留原策略，添加持续恢复阶段和可取消等待。
4. 用本地模拟服务覆盖连接拒绝、超时、403/HTML、502/503、流中断、服务恢复及长 Retry-After；虚拟时间验证等待上限和无限次重试不溢出。
5. 验证恢复后同一轮次继续、主动取消立即结束、状态不灌入模型上下文，检查已执行操作不被整体重跑。
6. 在真实 VS Code 验收后打包新引擎，核对 VSIX 差异、原生程序启动及回退方式，再交付。

以上是实施前结论与路线；当前安装、构建、恢复策略与验收结果见 [持续恢复实现与验收](vscode-persistent-recovery.md)。
