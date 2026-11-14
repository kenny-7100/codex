# Jimao VS Code 插件工程

来源：官方 `openai.chatgpt@26.51111.21308`（`darwin-arm64`，预发布）VSIX。
核实日期：2026-11-14（Asia/Shanghai）。原始包与解压产物始终保留在
[`references/vscode-extension/`](../references/vscode-extension/README.md)，本目录保存派生工程。

当前用户可见品牌为 **Jimao**，图标来自用户提供的 `kbtc.svg`。保留 `openai.chatgpt` 身份及原有数据读取方式，安装时替换同身份的官方扩展。品牌范围与约束见 [Jimao 品牌决定](../docs/decisions/002-jimao-branding.md)。

这个工程用于人与 Agent 一起定制插件。可理解、可定位、可修改、可验证是主要标准：
保留已经可读的实现；对难懂的关键路径再做进一步还原；第三方库和语言资源不逐个重写。
变量名与模块划分来自发布产物，未宣称恢复了官方未公开的 TypeScript/React 原始工程。

当前分支已实现聊天管理定制：小时级绝对时间、逐条改名、多标签，以及只包含名称、时间区间和标签的搜索面板。排序位于列表工具栏。使用与验收入口见 [聊天管理定制](docs/chat-management.md)。
当前输出是定制包；下文的字节一致性结论描述恢复完成时的未修改基线。

持续网络与模型供应商恢复已实现并通过故障注入及真实 VS Code 验收，构建环境、引擎开关、故障验收和打包回退方式见
[持续恢复实现与验收](../docs/research/vscode-persistent-recovery.md)。

## 开始使用

需要 Node.js 22+、npm、Python 3.9+。本机使用 Node.js 22.17.0；可选的真实宿主测试还需要
VS Code 的 `code` 命令。当前产物仅适用于 Apple Silicon macOS。

```sh
cd vscode-extension
npm ci --ignore-scripts
npm run bootstrap
# 首次 checkout 没有大型生成源码时：
npm run recover -- --refresh
npm run build
npm run package
npm run verify -- --allow-changes
npm test
npm run test:ui
npm run check-imports
```

`bootstrap` 按已记录的官方地址获取缺失的参考包并验证 SHA-256，已有原件不重写。
`recover -- --refresh` 只补齐缺失的 Webview 源码，不覆盖已有编辑。
当前工作区已经完成恢复，无需重新生成。

产物：`dist/openai.chatgpt-26.51111.21308-darwin-arm64-reconstructed.vsix`。
本地可直接加载 `build/extension/` 作为 Extension Development Host；无需安装覆盖日常插件。
用 VS Code 打开本目录，按 F5 可构建并启动调试实例；`--debug` 构建生成宿主源码映射，
可在 `src/extension-host/` 中设置断点。调试构建与默认字节复现构建是不同模式。

## 工程结构

| 路径 | 用途 |
| --- | --- |
| `src/manifest.json` | 可编辑的扩展清单，区别于工程自身的 `package.json` |
| `src/vsixmanifest.xml`、`src/content-types.xml` | VSIX 根元数据；更改身份、版本等时同步编辑 |
| `src/extension-host/` | 57 个有序宿主代码片段，按语法边界拆分，保留同一模块作用域 |
| `src/webview/` | 本地生成的可读 Webview 模块、CSS、HTML，保留原文件名和导入路径 |
| `overrides/` | Git 跟踪的 Webview 编辑、新模块及资源覆盖，路径相对于扩展根目录 |
| `recovery-manifest.json` | 源码哈希、原始语法树指纹、导入图和宿主拼接顺序 |
| `docs/host-symbols.json` | 宿主顶层符号与静态字符串线索索引 |
| `docs/architecture.md` | 已定位的关键类、入口、消息链路及定制位置 |
| `docs/validation.md` | 验收方法、证据和限制 |
| `scripts/` | 恢复、构建、差异验证、归档、查询与真实宿主测试 |
| `build/extension/` | 完整可运行插件；每次构建重建，可执行权限由原始 ZIP 恢复 |
| `reports/` | 本机生成的验证报告，不进入 Git |

约 614 MiB 的生成源码、原生程序、依赖、运行日志和 VSIX 不进入 Git；恢复脚本和清单、
可编辑的宿主片段与定制覆盖进入 Git。`build` 会把修改过的生成 Webview 文件保存到
`overrides/`，因此后续 checkout 可以恢复定制。提交前仍需检查 `git status`。

## 定制流程

1. 用 `docs/architecture.md` 或查询脚本定位入口。
2. 宿主改 `src/extension-host/`；界面改 `src/webview/`，或直接在 `overrides/webview/`
   中保存对应文件。不要同时在两处做不一致的编辑，构建会拒绝冲突。
3. `npm run build`。新增 JS、图片等放在 `overrides/`，并在调用模块中引用。
4. `npm run smoke -- --probe` 在独立 VS Code 数据目录验证真实宿主；或者运行
   `code --extensionDevelopmentPath="$(pwd)/build/extension" --enable-proposed-api openai.chatgpt` 手工调试。
5. `npm run package`，定制包用 `npm run verify -- --allow-changes` 查看实际改变的条目。
   未修改基线用 `npm run verify`，必须逐字节相同。

`npm run test:customization` 会在未定制基线上临时修改宿主和一个 Webview 模块，验证编辑进入
VSIX、覆盖保存和差异清单，然后恢复源码并重新生成字节一致的基线包。不要与其他构建并行运行。

已有覆盖的模块重新生成后，未编辑的生成源会自动采用 `overrides/` 中的定制。
撤销某个 Webview 定制时，删除对应覆盖，并恢复或删除对应生成文件后执行 refresh。
不要直接编辑 `build/`，下次构建会重建。

```sh
node scripts/query.mjs host 'Spawning codex app-server'
node scripts/query.mjs host Af
node scripts/query.mjs webview composer
node scripts/query.mjs importers rolldown-runtime
```

## 一致性如何实现

恢复阶段格式化 JS，并逐文件比较规范化 AST；宿主拼接后再比较整个程序。只忽略位置、
注释、字面量的打印细节，并归一化同种短路运算符的结合方式，保留操作数顺序。
不把算术结合方式或变量名变化视为相同。

默认构建对未编辑的、已通过 AST 检查的源码使用原发布字节；对修改的宿主重新拼接，
对修改的 Webview 模块输出编辑内容。`npm run build -- --readable` 可强制输出全部格式化源码。
打包器逐条比较构建内容与原包，只复用内容未变的 ZIP 压缩记录；改动条目重新压缩，
并重建偏移和目录。基线可据此保持原始压缩器、时间戳、顺序与元数据，达到字节一致。

因此这是**依赖原始产物的可编辑重建工程**，没有恢复官方构建流水线，也不支持在移除原包后
凭公开 Rust 源码重新编译出同一套原生程序。原生程序、媒体、字体、WASM 和未改资源继续复用
原始文件；对它们的进一步改造按具体需求处理。

已验证的基线 VSIX SHA-256：

```text
6cbfc1bba9237e9d3287ab18f246041c0746b19b1c5cbf674a04b74849f840ae
```

包内原生程序有 Apple 代码签名。保持其字节即可保留签名；本次没有遇到妨碍基线字节复现的
VSIX 签名结构。不应据此推断定制包也拥有 Marketplace 的官方签名或发布身份。
原插件及其依赖仍受各自原有许可约束，本目录的派生代码不因放入本仓库而自动适用 Apache-2.0。
