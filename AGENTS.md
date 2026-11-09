# plugin-uni

把官方 `@dcloudio/vite-plugin-uni`（CJS）以 ESM 形式重导出的薄壳：`src/index.js` 取一次 `uni.default ?? uni` 就完事，没有构建步骤，发布内容就是 `src/`。没有 CLAUDE.md。playground 是 workspace 成员，但没有独立 AGENTS.md，差异点写在下文。

## 项目

- 纯 JS：入口是 `.js` / `.cjs`，唯一的 `.ts` 是 `src/index.d.ts` 声明文件。没有 build、test、typecheck 脚本，根 `tsconfig.json` 也没有命令在用（playground 的类型检查用自己的 tsconfig）。
- Node 26（`.node-version`），pnpm 12.16.1（`packageManager`）。workspace 只有 `playground`。依赖版本全部集中在 `pnpm-workspace.yaml` 的 `catalog:`，根和 playground 的 `package.json` 一律写 `catalog:`，不要在包里写死版本；新增依赖要先加 catalog 条目。同一文件的 `allowBuilds` 放行 `core-js` / `core-js-pure` / `esbuild` 的构建脚本，缺了会让 `pnpm install` 直接失败（`ERR_PNPM_IGNORED_BUILDS`）。
- 发布形态：`files: ["src"]`；`exports["."]` 三个条件 —— `type` → `./src/index.d.ts`、`import` → `./src/index.js`、`require` → `./src/index.cjs`；另有 `exports["./*"] = "./*"` 直通文件。`main` 指向 `src/index.cjs`、`module` 指向 `src/index.js`、`types` 指向 `src/index.d.ts`，改入口时四处要一起改。
- peer 依赖 `@dcloudio/vite-plugin-uni: "*"`，不锁版本，官方插件升级不需要本包发版。
- Lint 是 `@antfu/eslint-config`（`type: 'lib'`），ESLint 10。没有 pre-commit 钩子，提交前自己跑 `pnpm lint`。`eslint.config.js` 关掉了 `pnpm-workspace.yaml` 上的 `pnpm/yaml-enforce-settings` 规则；YAML 的缩进、引号、空行仍会被 `eslint --fix` 重排。

## 命令

```bash
pnpm install                       # 安装依赖（catalog 在 pnpm-workspace.yaml）
pnpm lint                          # eslint
pnpm lint:fix                      # eslint --fix
pnpm play                          # cd playground && pnpm dev，起 uni-app dev server
pnpm -C playground run build       # 构建 playground 产物
pnpm -C playground run type-check  # playground 的 vue-tsc --noEmit
pnpm release                       # 维护者发布：bumpp
```

## 架构

| 路径 | 职责 |
| --- | --- |
| `src/index.js` | ESM 入口，全部内容就是 `export default uni.default ?? uni`。官方插件是 CJS 包，ESM 下 `import uni from '@dcloudio/vite-plugin-uni'` 拿到的是 `module.exports` 对象（`{ runDev, runBuild, default }`），所以必须取 `.default` |
| `src/index.cjs` | `require` 条件的入口：`const uni = require('@dcloudio/vite-plugin-uni')`，然后 `module.exports = uni.default ?? uni`，与 ESM 入口导出同一个工厂。改完在 playground 里实测：`node -e "console.log(typeof require('@uni-helper/plugin-uni'))"` 应为 `function` |
| `src/index.d.ts` | 类型入口，`export { default } from '@dcloudio/vite-plugin-uni'`。只转发默认导出，`VitePluginUniOptions` 等具名类型要从官方包导入 |
| `playground/` | 验证用 uni-app 应用，`workspace:*` 引用本包，`vite.config.ts` 里 `plugins: [Uni()]`；多个平台的 dev / build 脚本都在它的 `package.json` 里 |
| `.github/workflows/lint.yml` | push / PR 到 `main` 时跑 `pnpm i --frozen-lockfile` + `pnpm lint` |
| `.github/workflows/release.yml` | `v*` tag 触发：changelogithub 建 Release，再 `pnpm publish --access public`；带 `id-token: write`，npm 认证走 OIDC |

关键行为：

- **零逻辑转发**：本包不注册任何 Vite 钩子、不做转换，构建行为完全等于官方插件。构建异常先查官方插件，不要在本包里找原因。
- **类型对齐靠重导出**：`src/index.d.ts` 不做手写类型，官方插件的类型变化会自动跟过来。
- **没有测试**：验证只能靠 playground，`pnpm play` 起 dev server 看构建是否正常。
- **`logo.svg` / `banner.svg`** 是 README 引用的图：logo 256×256，主色 `#2B9939`；banner 1280×320。README 用 jsDelivr 的 `@main` 地址引用，改动要推上去才看得到。

## 约定

- 提交信息遵循 Conventional Commits（历史里有 `ci: bump action versions`、`docs: update README`、`chore: release v0.1.0`）。
- 改脚本名要同步 README 和 CONTRIBUTING（`play` / `lint` / `lint:fix` / `release` 都被文档引用）。
- README 是用户文档，中文；改用法、选项或入口时要一起更新。
- 版本由 `pnpm release`（bumpp）管理，打 `v*` tag 推送后自动发 npm，不要手动 `npm publish`。
- 改依赖版本时改 `pnpm-workspace.yaml` 的 `catalog:`，不要改 `package.json` 里的 `catalog:` 占位。
