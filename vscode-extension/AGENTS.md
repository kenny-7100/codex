# 插件定制协作

- 先读 `README.md` 和 `docs/architecture.md`，按任务查询 `docs/host-symbols.json` 和导入图，避免加载整个 Webview。
- 用户与 Agent 共同开发；已经能理解的代码可保留，不以恢复原始命名、TSX 或重写依赖为目标。
- `src/extension-host/` 按 `recovery-manifest.json` 顺序拼接，所有片段共享作用域。不要独立包装成模块或改变初始化顺序。
- 片段名表示检索线索，不是已恢复的官方模块边界。需要进一步拆分时验证作用域、初始化顺序和行为。
- 原始产物只读；派生代码、构建与日志都放本目录。不要把下载包或原生签名二进制纳入 Git。
- Webview 生成代码被忽略；`npm run build` 自动将编辑保存到受跟踪的 `overrides/`。交付前确认定制已进入覆盖目录。
- `recover -- --refresh` 只补齐缺失生成文件。不要删除恢复清单或通过重新生成覆盖用户定制。
- 修改后执行相关测试；基线必须 `npm run verify`，定制包用 `npm run verify -- --allow-changes` 核对差异。
- 真实宿主测试用独立数据目录。运行日志可能含本机路径和账号上下文，不提交原始日志。
- 正确区分字节一致、AST 一致、启动冒烟检查与完整功能测试；没有运行的功能不能描述为已通过。
