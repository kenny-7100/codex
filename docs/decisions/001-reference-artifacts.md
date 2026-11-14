# 001：本地保留官方插件参考产物

日期：2026-11-14（Asia/Shanghai）。状态：当前采用。
范围：`references/vscode-extension/`；用户要求在 `codexx` 分支下载解压以供对照研究。

## 决定与理由

保留官方 VSIX 和完整解压内容，供检查扩展宿主、Webview 与原生程序的关系。
原始产物不修改，派生分析文件另存。下载来源、版本和校验值保存在 `provenance.json`。

当前采用局部 `.gitignore` 忽略 VSIX 和解压目录，只将指南、来源记录及忽略规则纳入 Git 候选。
这是此前执行时为控制仓库体积作出的选择，并非用户要求禁止提交产物。
包大小约 354 MB，解压内容约 971 MB、15,473 个文件，直接提交会显著增加仓库体积。

## 影响与替代条件

- 下载产物只在本地存在，切换分支不会自动移除，其他机器 checkout 不会获得它们。
- 定向使用 `rg --no-ignore` 搜索，常规全仓库检索无需包含这些打包资源。
- 可根据来源记录重新下载并核对 SHA-256；不要直接把“latest”当成同一版本。
- 用户需要跨机器分发或将产物版本化时，重新选择发布资产、对象存储或 Git LFS 等方案。
- 插件许可独立于当前仓库，分发前需依据插件本身的许可判断。

证据：[阅读指南](../../references/vscode-extension/README.md)、
[来源记录](../../references/vscode-extension/provenance.json)、
[忽略规则](../../references/vscode-extension/.gitignore)。
