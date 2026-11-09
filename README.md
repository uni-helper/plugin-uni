<a href="https://uni-helper.js.org/plugin-uni"><img src="https://cdn.jsdelivr.net/gh/uni-helper/plugin-uni@main/banner.svg" alt="banner" width="100%"/></a>

# @uni-helper/plugin-uni

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/uni-helper/plugin-uni@main/logo.svg" alt="logo" width="256" height="256"/>
</p>

<p align="center">
  <a href="https://github.com/uni-helper/plugin-uni/blob/main/LICENSE"><img src="https://img.shields.io/github/license/uni-helper/plugin-uni?style=for-the-badge&labelColor=005947&color=eee" alt="License"></a>
  <a href="https://github.com/uni-helper/plugin-uni/stargazers"><img src="https://img.shields.io/github/stars/uni-helper/plugin-uni?style=for-the-badge&labelColor=005947&color=eee" alt="Stars"></a>
  <a href="https://npmx.dev/package/@uni-helper/plugin-uni"><img src="https://img.shields.io/npm/v/@uni-helper/plugin-uni?style=for-the-badge&labelColor=005947&color=eee" alt="NPM Version"></a>
  <a href="https://npmx.dev/package/@uni-helper/plugin-uni"><img src="https://img.shields.io/npm/dm/@uni-helper/plugin-uni?style=for-the-badge&labelColor=005947&color=eee" alt="NPM Downloads"></a>
</p>
<p align="center">
  <a href="https://github.com/FliPPeDround"><img src="https://img.shields.io/badge/Author-FliPPeDround-blue?style=for-the-badge" alt="Author"></a>
</p>

把官方 `@dcloudio/vite-plugin-uni` 以 ESM 形式导出，在 ESM 配置里直接 `import`。

不想看文档？直接问 AI 🤖 <a href="https://deepwiki.com/uni-helper/plugin-uni"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>

> **请考虑持续[赞助](https://afdian.com/a/flippedround)以维持该项目的持续健康发展，非常感谢！🙏**

## 简介

`@dcloudio/vite-plugin-uni` 是 CJS 包。在 ESM 配置里 `import Uni from '@dcloudio/vite-plugin-uni'` 拿到的是整个 `module.exports`，还得自己再取一次 `.default`。本包把这一步包好，只做重导出，不包含运行时逻辑，也不限制官方插件的版本。

## 安装

```shell
npm i -D @uni-helper/plugin-uni
```

官方插件 `@dcloudio/vite-plugin-uni` 需要自己装，本包通过 `peerDependencies` 使用它。

## 使用

```ts
// vite.config.ts
import Uni from '@uni-helper/plugin-uni'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Uni(),
  ],
})
```

配置按 ESM 写（`import`）即可，playground 的 `package.json` 设了 `"type": "module"`。

`Uni()` 的选项和官方插件相同：`uvue`、`vueOptions`、`vueJsxOptions`、`viteLegacyOptions`、`autoImportOptions`。需要用类型时从 `@dcloudio/vite-plugin-uni` 导入。

## 工作原理

- `src/index.js` 只有一行 `export default uni.default ?? uni`：官方插件带 `.default` 就取它，否则直接用导入结果。
- `src/index.cjs` 是 `require` 条件的入口，写法相同：`module.exports = uni.default ?? uni`。
- `src/index.d.ts` 重导出官方插件的默认类型，IDE 提示和官方插件保持一致。
- `peerDependencies` 写的是 `*`，官方插件用哪个版本由你的项目决定，本包不用跟着发版。

## 问题反馈

构建出错时先确认是不是官方插件的问题，是的话提到 [dcloudio/uni-app](https://github.com/dcloudio/uni-app/issues)。

确认问题出在转发层，再到 [uni-helper/plugin-uni](https://github.com/uni-helper/plugin-uni) 提 issue，附上最小复现仓库。

官方插件提供原生 ESM 版本后，本包会归档并停止维护。

## 参与贡献

请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可证

[MIT](https://github.com/uni-helper/plugin-uni/blob/main/LICENSE)

## 赞助

<p align="center">
  <a href="https://afdian.com/a/flippedround">
    <img alt="sponsors" src="https://cdn.jsdelivr.net/gh/FliPPeDround/sponsors/sponsorkit/sponsors.svg"/>
  </a>
</p>
