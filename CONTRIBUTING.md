# 参与贡献

感谢你抽时间参与。本文介绍项目结构、本地开发流程、检查方式和提交规范。

## 前置条件

- [Node.js](https://nodejs.org/) 26（见 `.node-version`）
- [pnpm](https://pnpm.io/) 12.16.1（见 `package.json` 的 `packageManager`，建议配合 Corepack 启用）

## 仓库结构

```text
.
├── src/
│   ├── index.js          # ESM 入口，重导出官方插件
│   ├── index.cjs         # CJS 入口，同样重导出官方插件
│   └── index.d.ts        # 类型入口，重导出官方插件的默认类型
├── playground/           # 示例 uni-app 应用（workspace 成员，用来本地验证）
├── .github/workflows/    # lint 与发布流程
├── eslint.config.js      # @antfu/eslint-config
└── logo.svg
```

本包没有构建步骤，发布出去的文件就是 `src/` 目录。

依赖版本统一写在 `pnpm-workspace.yaml` 的 `catalog:` 里，根和 playground 的 `package.json` 一律写 `catalog:`，改版本只改 catalog 一处。

## 本地开发

```bash
pnpm install                       # 安装依赖
pnpm play                          # 进入 playground 起 uni-app dev server
pnpm -C playground run build       # 构建 playground，检查产物
pnpm -C playground run type-check  # playground 的 vue-tsc 类型检查
```

插件本身不需要编译。playground 通过 `workspace:*` 引用本包，改完 `src/` 里的文件重启 dev server 就能看到效果。

仓库没有提交钩子，提交前自己跑一遍 `pnpm lint`。

## 检查

```bash
pnpm lint       # ESLint 检查
pnpm lint:fix   # ESLint 自动修复
```

仓库目前没有测试用例，CI 也只跑 ESLint（`.github/workflows/lint.yml`，push 和 PR 到 `main` 时触发）。改完代码后在 playground 里跑一遍，确认 uni-app 能正常构建。

## 提交规范

1. Fork 仓库并新建分支。
2. 提交信息用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，例如 `feat: 支持 xxx`、`fix: 修正 xxx`、`docs: 更新 README`、`chore: release v0.1.0`。
3. 推送分支并开 Pull Request，写清改动的原因。

## Pull Request 指南

- 一个 PR 只解决一个问题，不要夹带无关改动。
- 改了脚本名、`exports` 或用法时，同步更新 README、`AGENTS.md` 和本文件。
- 动 `src/index.cjs` 时在 CJS 环境里验证一遍：`require('@uni-helper/plugin-uni')` 应该能拿到插件工厂。
- 涉及用法变化时，在 PR 描述里写清迁移方式。

## 发布

仅维护者操作：

1. `pnpm release` 调用 bumpp，改版本号、提交并打 `v*` tag。
2. tag 推送后 `.github/workflows/release.yml` 触发：用 changelogithub 生成 GitHub Release，再 `pnpm publish --access public` 发到 npm。工作流带 `id-token: write` 权限，npm 认证走 OIDC，仓库里不用存长期 token。

## 行为准则

本项目遵循 [uni-helper 行为准则](https://github.com/uni-helper/.github/blob/main/CODE_OF_CONDUCT.md)。

有问题或建议请到 [GitHub Issues](https://github.com/uni-helper/plugin-uni/issues) 反馈。
