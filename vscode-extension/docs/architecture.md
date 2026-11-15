# 插件结构与定制入口

适用：`openai.chatgpt@26.51111.21308`，2026-11-14 核实。
下面的职责来自静态代码与实际宿主启动检查；描述性名字是阅读别名，源码仍保留发布包的符号名。

## 扩展宿主

| 阅读别名 | 发布符号 | 主要位置与证据 |
| --- | --- | --- |
| 激活入口 | `IZt` | `../src/extension-host/056-activation.js`：创建服务、启动进程、注册侧栏、编辑器和命令 |
| 退出入口 | `PZt` | 同文件：等待保存/清理回调 |
| App-server 连接 | `wL` | `../src/extension-host/048-editor-integration.js`：`startCodexProcess`、`sendRequest`、`handleIncomingMessage` |
| Webview 控制器 | `Af` | `../src/extension-host/051-webview-messaging.js`：`initializeWebview`、`handleMessage`、`postMessageToWebview` |
| 会话列表提供者 | `vL` | `../src/extension-host/048-editor-integration.js`：`provideChatSessionItems`、`handleMcpNotification` |
| 会话摘要加载 | `A9` | 同文件：`requestThreadList`、`toThreadListSummary` |
| 原生程序路径 | `T9` | 同文件：读取 `chatgpt.cliExecutable`，否则定位包内平台程序 |

57 个代码片段按原顶层语句顺序拆分，不能单独 `import` 执行。
大部分共享库初始化位于前面的片段。类可能跨越多个职责，因此文件名只提供粗粒度检索线索。
符号索引保留了函数/变量定义及附近静态字符串，适合 Agent 从错误消息、协议名称反查。

激活入口可直接看到：创建 `wL` → `startCodexProcess()` → 创建 `Af` → 注册侧栏和自定义编辑器。
启动参数包括 `-c features.code_mode_host=true -c features.windows_sandbox_service=true app-server
--analytics-default-enabled`。连接类使用 stdin/stdout 和 JSONL 消息；不应因内部仍有 `Mcp`
命名，就将这条链路笼统视为外部 MCP 工具服务器。

`Af.initializeWebview` 设置脚本执行、资源根目录和消息监听；`Af.handleMessage` 根据
`type` 分派请求。定位新的 UI 行为时，先在该方法及 `src/webview/` 中匹配消息类型，
再沿连接类追踪具体协议请求。Rust 协议定义可对照仓库的 `codex-rs/app-server-protocol/`；
当前 Rust checkout 与包内二进制的精确提交对应关系尚未验证。

## Webview

入口是 `src/webview/index.html`，加载 `assets/index-ebe4f148cdcd.js`，并预加载若干
`app-initial-*` 和 `rolldown-runtime-*` 模块。模块间保留构建产物的相对导入和导出别名；
无需先恢复 React JSX 才能编辑函数和组件实现。

按文件名定位通常比全局搜索更快：

| 主题 | 文件线索 |
| --- | --- |
| 入口与懒加载 | `index-ebe4f148cdcd.js`、`app-main-41dbfc8a5b92.js` |
| 输入框与交互 | `composer-*`、`codex-composer-adapter-83cb4850bf42.js` |
| 设置 | `settings-*`、`general-settings-*`、`appearance-settings-*` |
| 会话呈现与状态 | `thread-*`、`conversation-*`、`local-conversation-*` |
| 插件专用实现 | 名称包含 `.extension-` 的模块 |
| 平台消息桥 | 对 `acquireVsCodeApi`、`postMessage`、宿主消息 `type` 做定向检索 |

这些主题是候选入口，不表示所有对应文件均在插件当前路由下执行。发布包包含多种应用共享
模块与资源；是否实际加载应结合导入图和运行时确认。

`recovery-manifest.json` 记录 55,386 条导入记录，其中包含非字面量的动态导入。
所有可解析的相对路径已检查存在；这不证明由变量计算出的所有运行时路径都正确。

## 聊天管理定制入口

新增模块、原会话管理器接入和消息桥位置见 [聊天管理定制](chat-management.md)。

## 进一步还原的判断

已有方法名和字段足够解释行为时，保持实现并补充局部说明。若目标模块仍难懂，可在明确的
测试覆盖下对局部变量命名、提取函数或组件；不要跨整个产物批量猜测命名。
新增模块放 `overrides/`，宿主新增逻辑可先在所属片段中提取函数，保留初始化顺序。
完成一个定制后验证实际触发路径，并检查 VSIX 差异是否只落在预期文件上。

## 家庭局域网入口

插件管理独立共享入口进程，每个已接入窗口创建浏览器虚拟 Webview，继续复用原初始化、客户端协调 RPC 和独立引擎。使用与代码入口见 [局域网访问](lan-access.md)。

## 首次加载与启动头像

2026-11-15 核实（26.51111.21308）：`app-initial-f8f84852daaa.js` 的 `GPo`
通过 Statsig React SDK 的 `useClientAsyncInit` 等待远程功能配置，加载期间不渲染子界面。
它与登录认证、宿主服务初始化是不同的等待点。SDK 默认网络超时为 10 秒，实际请求和重试可能带来明显等待。
`scripts/startup.mjs` 在构建副本中给 SDK 初始调用传入其原生 `timeoutMs: 1200`；超时使用
SDK 缓存/默认配置，原网络请求继续进入数据适配器缓存，保留原在线恢复与 live refresh 机制。
不伪造配置响应、不更改认证与权限判断，也不额外强制初始化/刷新，避免运行界面被新增的配置刷新打断。
慢网下本次会话的实验功能可能暂用默认值；这不是全部启动耗时的上限。
构建钩子要求已定位的 SDK 调用恰好匹配一次，上游改变时必须复核，禁止静默跳过。

静态 HTML、React provider fallback 和路由占位原先分别管理加载图，包含延迟出现及不同容器。
`scripts/branding.mjs` 将静态头像容器置于 React `#root` 外；新增
`overrides/webview/assets/jimao-startup.js` 观察应用根节点，跨空提交和品牌加载占位保留同一头像，
出现正文或可交互内容后永久撤下。错误文字和登录控件也能结束启动图，不能只等聊天输入框。
`qA` 为品牌加载占位增加显式类名，统一视口居中、大小和可爱抖动，移除旧光晕与延迟淡入；
减少动态效果时保持静止。后续正常加载不重新挂载静态启动图。
