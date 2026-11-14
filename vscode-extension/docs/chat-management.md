# 聊天管理定制

适用：`openai.chatgpt@26.51111.21308` / `darwin-arm64` 派生工程。核实日期：2026-11-14。

当前界面按用户最终确认的范围收敛：搜索区只有名称、开始时间、结束时间和标签。
排序位于聊天列表工具栏。项目、主机、正文搜索、状态、归档、AND/OR 和常用查询控件不在界面展示。

## 使用

- 打开最近聊天面板，按名称搜索；可直接组合开始/结束时间与标签。
- 时间区间始终按聊天更新时间筛选，使用本机时区，包含起止时刻；改变列表排序不改变时间区间的含义。
- 标签支持多个，逗号分隔；多个标签同时匹配。条目上的 `#` 编辑标签；标签与聊天名称同一行、紧随名称右侧，点击标签可进入筛选。较多标签在原行横向滚动，不另起一行。
- 条目上的 `✎` 手动改名，支持取消、保存失败反馈，名称 1–60 个字符。保存调用原插件的会话管理器和后端确认链路。
- 列表工具栏提供最近/最早更新、最近/最早创建和名称排序，以及刷新、清空筛选。
- 搜索结果每页显示 10 条，底部提供上一页、下一页和页码；筛选、排序或刷新后回到第一页，翻页后列表回到顶部。只挂载当前页的行组件，避免为全部历史同时创建编辑控件、订阅和时间刷新定时器；筛选与排序结果使用 React 缓存。
- 面板自动逐页加载本机未归档历史摘要，以保留全历史名称、时间和标签搜索；界面分页不等于后端仅读取 10 条，也不加载会话正文。其他主机仅包含原插件已加载的聊天。加载失败会提示，不把部分结果宣称为完整历史。
- 时间不足一小时显示相对分钟；满一小时显示本地 `YYYY-MM-DD HH:mm:ss`。时间会定期刷新。

面板桌面高度最多 760px / 80vh，列表单独滚动；右上角 `×` 可直接关闭。窄屏日期并排，标签筛选栏另起一行，聊天条目的标签仍紧随名称显示。
标签管理可以重命名或删除某个标签，删除前有确认。标签和最近的筛选保存在 VS Code
扩展的本机 `globalState`，同一扩展宿主的多个 Webview 收到更新广播；不承诺跨 VS Code 进程实时同步或云同步。

## 实现入口

| 模块 | 职责 |
| --- | --- |
| `overrides/webview/assets/chat-manager-core.js` | 时间、标签、筛选和分页逻辑 |
| `overrides/webview/assets/chat-manager-store.js` | 宿主消息、元数据状态、原生协议请求、标题通知 |
| `overrides/webview/assets/chat-manager-ui.js` | 搜索面板、列表工具栏、条目改名与标签编辑 |
| `overrides/out/chat-manager-host.cjs` | 串行处理元数据写入，避免多个 Webview 相互覆盖 |
| `src/extension-host/051-webview-messaging.js` | 接入元数据消息 |
| `overrides/webview/assets/header-92de4b85dd13.js` | 替换原最近聊天搜索和时间呈现 |
| `overrides/webview/assets/app-initial-17dd08407f00.js` | 接入原消息桥、全局聊天条目和原生改名管理器 |

新增逻辑采用有意义的模块和变量命名；原可理解的发布模块保持原符号。
样式在每个 Webview 文档只插入一份，避免历史列表每行复制整份 CSS。
核心模块保留了初期高级查询的组合能力，但当前产品界面只使用上述精简范围。

## 验证与复现

```sh
npm test
npm run test:ui
npm run smoke -- --probe
npm run check-imports
npm run package
npm run verify -- --allow-changes
```

浏览器验收使用本机 Google Chrome：6 项测试覆盖简洁控件、时间格式、改名保存/失败/取消、
标签持久化与管理、组合过滤、超过 100 条的自动分页、列表排序、每页十条与首末页边界、跨页搜索及页码重置、标签同行布局、面板关闭/重新打开和窄屏布局。
运行真实 UI 组件和宿主元数据处理器；原生协议与改名后端在该测试中用 fixture 模拟。
`reports/chat-manager-desktop.png`、`reports/chat-manager-mobile.png` 是合成数据截图。

真实 VS Code 验收另运行原 Webview、原消息桥、原会话管理器和包内 app-server。
用本机临时目录启动下方独立宿主，然后在另一个终端运行控制器。控制器将测试窗口置于前台，并处理独立配置的首次引导：

```sh
# cwd: vscode-extension
# 每次运行前删除上次 reports/vscode-acceptance-finished.json（若存在）。
code --new-window --skip-welcome --skip-release-notes --disable-extensions \
  --user-data-dir /tmp/codexx-chat-acceptance/user-data \
  --extensions-dir /tmp/codexx-chat-acceptance/extensions \
  --extensionDevelopmentPath "$PWD/build/extension" \
  --extensionTestsPath "$PWD/test/vscode-acceptance.cjs" \
  --enable-proposed-api openai.chatgpt --remote-debugging-port=9338 \
  --disable-background-timer-throttling --disable-renderer-backgrounding \
  --disable-backgrounding-occluded-windows
node test/vscode-ui-controller.mjs
```

控制器创建一个不运行模型的空测试会话，实际点击条目改名与标签编辑，再通过原生 `thread/read`
和真实 `globalState` 回读确认；检查名称过滤、列表排序位置和面板尺寸。结束时清除测试标签并归档测试会话。
真实宿主仍会读取本机 Codex 配置与历史，独立 VS Code 数据目录不等于独立 CODEX_HOME。
报告只保存断言与尺寸，截图限定到合成测试名称，原始运行日志不提交。

完整回归对上游每个未修改功能没有逐项重做；打包验证确保未涉及资源的内容保持原样。

## 聊天管理阶段验收结果

- `npm test`：10 项逻辑、宿主存储与构建归档测试通过。
- `npm run test:ui`：5 项浏览器场景通过（桌面 960×1000、窄屏 390×740）。
- 真实 VS Code 1.145.2：创建空测试会话，原生改名回读、标签回读和新名称搜索通过；最近一次真实界面面板高度约 569px，结果列表约 342px，无横向溢出；标签同行、点击筛选、关闭与重新打开均已验证。测试会话已归档、测试标签已清除。
- 定制归档：只修改 3 个原有 JS 文件并新增 4 个模块，无删除条目；其他原条目内容一致，ZIP CRC 有效。原生程序未修改。

原始详细报告在本机 `reports/`，不提交运行日志或用户聊天内容。

后续持续恢复构建已替换主 Rust 引擎；当前 VSIX 差异与新引擎验收见
[持续恢复实现与验收](../../docs/research/vscode-persistent-recovery.md)。

## Jimao 十条分页验收（2026-11-14）

代码核查确认旧面板会对全部匹配结果执行 `renderRow`，每行挂载独立的状态订阅与时间刷新定时器。
当前分页将结果行组件数量限制为十个；134 条合成历史分为十四页，末页四条，搜索仍可找到第 120 条历史。
`npm test` 14 项与 `npm run test:ui` 6 项通过，桌面与窄屏布局、改名和标签回归通过。
构建、打包、`verify -- --allow-changes`（CRC 有效，无删除条目）、导入检查和 VS Code 1.145.2 启动冒烟检查通过。
新 VSIX 已覆盖安装至本机同身份扩展；安装目录、VSIX 与受跟踪覆盖文件的分页 UI 字节一致，当前已打开窗口需重载后生效。
没有对用户真实会话库做性能采样，因此不将组件数量减少描述为已经测得的响应耗时改善。
完整历史摘要的读取与内存占用仍随会话数增长；若后续确认读取阶段仍慢，需要另行设计服务端筛选与游标分页。
