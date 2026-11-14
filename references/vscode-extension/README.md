# Codex VS Code 插件：本地对照阅读资料

本目录用于结合官方 VS Code 插件发布包和当前 Codex Rust 仓库学习实现。
可编辑派生工程位于根目录的 [vscode-extension](../../vscode-extension/README.md)，
原始包和本目录解压文件继续保留原样。

## 下载记录

- 扩展 ID：`openai.chatgpt`
- 发布者：`openai`
- 版本：`26.51111.21308`，预发布版（下载时 Marketplace 返回的最新版本）
- 平台：`darwin-arm64`，匹配当前 Apple Silicon Mac
- 下载日期：2026-11-14（Asia/Shanghai）
- 对照仓库提交：`69231e119b`；下载操作所在分支：`codexx`
- [官方发布页](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt)
- 精确下载地址、Marketplace 元数据和 SHA-256：见 [provenance.json](provenance.json)

原始包为 `openai.chatgpt-26.51111.21308-darwin-arm64.vsix`（354,245,795 字节）。
完整解压到 `openai.chatgpt-26.51111.21308-darwin-arm64/`，共 15,473 个文件。
下载后已核对 Marketplace 的 SHA-256，并通过 ZIP 全文件 CRC 检查。

VSIX 和解压产物被本目录 `.gitignore` 忽略，保留在本地；阅读指南和来源记录可以随分支提交。
这些被忽略的文件不会随分支切换消失，也不会自动出现在其他机器的 checkout 中。
没有安装或执行包内的扩展和原生程序。

## 包含什么

以下路径均相对于解压后的 `extension/`：

| 路径 | 内容 |
| --- | --- |
| `package.json` | 扩展声明、激活条件、命令、配置、视图与快捷键 |
| `out/extension.js` | 打包后的扩展宿主入口，约 2.54 MB；可搜索服务启动和 Webview 通信 |
| `webview/index.html` | Webview HTML 入口及首批 JS/CSS 引用 |
| `webview/assets/` | 打包后的界面代码、语言包、样式和媒体资源 |
| `bin/macos-aarch64/codex` | 随插件发布的 Codex 原生程序 |
| `bin/macos-aarch64/codex-code-mode-host` | Code Mode 原生宿主 |
| `bin/macos-aarch64/codex-resources/` | 原生运行资源，包括语音相关资源 |
| `resources/`、`syntaxes/` | 编辑器资源和语法定义 |
| `LICENSE.md` | 发布包自己的许可说明 |

包内没有发现 `.map` source map 或原始 `.ts` / `.tsx` 工程；`package.json` 没有 `repository` 字段。
这是官方发布产物，不能据此还原完整的原始源码组织。打包代码包含依赖和生成内容，不能把每段代码都视为插件团队手写的逻辑。
包内许可指向 OpenAI 使用条款；不要把本仓库的 Apache-2.0 许可自动套用到插件产物。

## 原始源码的公开范围

核实日期：2026-11-14（Asia/Shanghai），本地包版本为 `26.51111.21308`。

- 本次重新扫描整个 `extension/`，没有 `.ts`、`.tsx` 或 `.map` 文件；扩展清单也没有
  `repository`、`homepage` 或 `bugs` 字段。`out/extension.js` 和 `webview/assets/` 是可阅读的
  打包代码，不能等同于完整原始工程或可复现构建所需源码。
- 在 [源码与许可询问 #2938](https://github.com/openai/codex/issues/2938#issuecomment-3460156887)
  中，`etraut-openai` 于 2025-10-29 明确回复：扩展没有开源，可视为围绕开源 CLI 的 UI 包装层。
- 在 [请求开源 #5822](https://github.com/openai/codex/issues/5822#issuecomment-3457392484)
  中，`gpeal` 于 2025-10-28 回复短期没有开源计划，长期保持开放选项。这是历史回复，不能据此保证未来状态。
- 本次检索官方公开仓库 `openai/codex` 及 OpenAI 组织中名称或描述含 `vscode` 的仓库，
  没有定位到该插件的完整原始工程，也没有找到该发布版本对应的前端源码提交。
- Agent 核心、app-server 和协议实现可从本仓库 `codex-rs/` 阅读；这不证明包内原生程序
  与当前 checkout 来自同一提交。精确版本对应关系仍需单独验证。

## 建议的对照阅读顺序

1. **扩展如何进入 VS Code**：先读 `package.json` 的 `main`、`activationEvents` 和 `contributes`。
   当前入口是 `./out/extension.js`，激活事件包括 `onStartupFinished`、`onUri`。
2. **编辑器如何和界面通信**：在 `out/extension.js` 搜索 `postMessage`、`onDidReceiveMessage`；
   从 `webview/index.html` 的 `./assets/index-ebe4f148cdcd.js` 继续追踪界面入口。
3. **插件如何使用 Agent 服务**：在扩展入口搜索 `app-server`、`thread/start`、`turn/start`。
   对照仓库 `codex-rs/cli/src/main.rs`、`codex-rs/app-server/src/` 和
   `codex-rs/app-server-protocol/src/`，确认具体请求和事件的定义。
4. **一次任务如何执行**：从协议处理继续到 `codex-rs/core/src/session/`，
   重点看 `turn.rs`，并结合 `codex-rs/core/src/tools/` 理解工具调用。
5. **命令如何执行及隔离**：继续阅读 `codex-rs/exec-server/`、`codex-rs/sandboxing/` 及平台沙箱模块。

这里的服务关联由包内检索结果提供线索，并非已经逐项验证的完整调用图。
发布包与仓库 HEAD 不是同一构建，方法名、实验功能和协议字段可能存在差异；遇到差异应先核实版本。
扩展清单还声明 `openai.codex-audio` 扩展包成员；本次只下载 `openai.chatgpt`，没有另外下载音频扩展。

## 搜索示例

在仓库根目录运行。下载产物被 Git 忽略，所以 `rg` 需要显式使用 `--no-ignore`。
打包 JS 的单行可能非常长，使用 `-o` 和输出限制避免整行刷屏。

```bash
# 扩展宿主和 Webview 消息处理线索
rg --no-ignore -o 'onDidReceiveMessage|postMessage|thread/start|turn/start|app-server' \
  references/vscode-extension/openai.chatgpt-26.51111.21308-darwin-arm64/extension/out/extension.js

# 仓库中对应的协议定义和处理位置
rg -n '"thread/start"|"turn/start"' codex-rs/app-server-protocol codex-rs/app-server
```

后续如需格式化 JS 或提取模块，建议另建派生目录，保留这里的解压产物原样，以便核对来源。
