# 项目协作指引

## 目标与范围

- 本分支用于研究 Codex、官方 VS Code 插件发布包及人与 Agent 的协作实践。
- 保留上游代码和文档的原有用途；研究、协作资料放在对应的新增目录。
- 开始任务时确认当前分支和工作区状态，保留用户已有改动与暂存状态。
- 修改模块前读取该路径适用的子目录 `AGENTS.md`。

## 按需读取

- 协作知识入口：[docs/collaboration/index.md](docs/collaboration/index.md)。
- 用户工作偏好：[working-preferences.md](docs/collaboration/working-preferences.md)。
- 知识维护规则：[knowledge-maintenance.md](docs/collaboration/knowledge-maintenance.md)。
- 研究入口：[docs/research/index.md](docs/research/index.md)。
- 决策入口：[docs/decisions/index.md](docs/decisions/index.md)。
- 项目 Skills 位于 `.codex/skills/<skill-name>/SKILL.md`，按任务选用。
- 只加载当前任务相关资料，不把整个知识库或插件包灌入上下文。

## 工作方式

- 仓库事实先通过代码、配置和测试查证；向用户询问需要其决定的重要取舍。
- 明确目标、范围和可观察的验收条件；简单任务直接推进，复杂任务分为可验证阶段。
- 在已授权范围内持续完成工作，避免重复请求确认；不擅自扩展到外部发布或消息发送。
- 改动围绕目标，避免顺带重构；让每个阶段保持可审查。
- 区分代码证据、历史做法、推断和建议；不能从公开仓库推定未公开的内部工作流。
- 研究结论注明版本和来源；插件发布包与仓库 HEAD 不应假定为同一构建。

## 参考产物

- 插件包位于 `references/vscode-extension/`，入口见其 `README.md`。
- 原始 VSIX 和解压文件保持原样；格式化、提取等派生文件另放目录并注明来源。
- 下载产物被局部 `.gitignore` 忽略，定向检索时使用 `rg --no-ignore`。
- 不把插件产物的许可视为本仓库 Apache-2.0 的一部分。

## 验证与交付

- 按改动风险验证实际行为；文档变更检查链接、事实和结构，无需运行 Rust 测试。
- Rust 构建与检查入口见 `justfile`、`docs/install.md` 和适用的模块指引。
- 验证受限时说明具体未验证部分；不把推测或命令未执行描述为通过。
- 交付说明最终变化、验证证据、重要限制，以及本次有意义的知识更新。
- 未获指示不自动提交、推送或改变暂存区。

## 用户说 push 时

- 直接执行 `git add . && git commit -m 'xxx' && git push`，这代表用户授权暂存全部改动、提交并推送。
- 根据当前会话上下文快速生成提交说明，格式为 `feat: xxx`、`fix: xxx` 或 `chore: xxx`。
- 说明尽量使用小写字母，专有名称按其规范大小写保留。
- 不为生成说明额外扫描仓库、分析 diff 或运行检查。
- 命令结束后简要报告结果；失败即报告，不自动重试、修复或改用其他推送参数。

## 主动沉淀

- 完成任务或重要阶段时，检查是否产生稳定偏好、可复用方法、已验证项目知识或关键决策。
- 有明确依据且属于本项目的文档与 Skill 更新已获授权，可直接执行并在交付时简述。
- 先检索已有资料并修订，避免每次追加重复条目；没有新知识就不写。
- 用户明确的长期偏好可以直接记录；临时约束和单次推测不能升级为长期习惯。
- 知识进入 `docs/`，可重复执行的流程进入 `.codex/skills/`；根文件只保留共同约束和入口。
- 按 [维护规则](docs/collaboration/knowledge-maintenance.md)执行；需要具体沉淀流程时使用
  [capture-project-learning](.codex/skills/capture-project-learning/SKILL.md)。
- 不把聊天日志、凭据、无关个人信息或未经核实的结论写成长期知识。
- 根文件力求简明，通常不超过约 200 行；细节移动到关联文档，行数不是硬限制。
