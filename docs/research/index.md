# Codex 与插件研究入口

适用范围：当前 checkout 与本地官方插件发布包。核实日期：2026-11-14（Asia/Shanghai）。

| 资料 | 用途 |
| --- | --- |
| [分支定位与长期方向](project-direction.md) | 个人定制、移植、调试和学习平台的目标与当前边界 |
| [插件包阅读指南](../../references/vscode-extension/README.md) | 下载版本、文件结构、搜索方法及源码对照线索 |
| [插件可定制重建工程](../../vscode-extension/README.md) | 可编辑宿主、Webview 恢复、构建与字节一致性验证 |
| [Jimao 家庭局域网访问](../../vscode-extension/docs/lan-access.md) | 共享入口进程、窗口选择器、原宿主消息桥、图片与真实宿主验收 |
| [聊天管理定制与验收](../../vscode-extension/docs/chat-management.md) | 名称、时间、标签搜索，改名与标签持久化，以及真实宿主验收入口 |
| [Rust 引擎开发与交付条件](vscode-engine-development.md) | 当前 Mac 环境、持续恢复需求、Rust 修改位置、VSIX 内置引擎安装与实施前置条件 |
| [持续恢复实现与验收](vscode-persistent-recovery.md) | 定制恢复状态机、外置 Rust 构建环境、故障注入、原生引擎打包与回退 |
| [插件网络故障恢复](vscode-network-recovery.md) | 连接失败持续重试、有界重试、传输回退与包内二进制隔离验证 |
| [插件来源记录](../../references/vscode-extension/provenance.json) | 精确下载地址、SHA-256 和 Marketplace 元数据 |
| [本地参考产物决策](../decisions/001-reference-artifacts.md) | 为什么保留完整下载产物并在 Git 中忽略 |

当前插件版本为 `26.51111.21308`（`darwin-arm64`，预发布），下载时的仓库提交为
`69231e119b`。它们不是已确认的同一构建；完整调用链尚需逐项研究。
研究页出现经过验证的新主题后再扩展本索引，不预先建立空的架构文档。

## 历史协作资料

以下是历史证据，不是当前生效指令：

- [历史根 AGENTS.md](https://github.com/openai/codex/blob/5e96aabd68dc6194f5ad928cb7f5d0bc71b72df9/AGENTS.md)。
- [历史项目 Skills](https://github.com/openai/codex/tree/5e96aabd68dc6194f5ad928cb7f5d0bc71b72df9/.codex/skills)。
- [删除上述配置的 PR #49713](https://github.com/openai/codex/pull/49713)。

本地也可执行 `git show '18131270fe^:AGENTS.md'` 查看历史文件。
删除记录说明移除了哪些文件，没有公开解释删除动机，不能推断其内部替代方案。
