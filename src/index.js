import uni from '@dcloudio/vite-plugin-uni'

export default (options) => {
  // @ts-expect-error 在ESM下导出cjs模块
  return uni.default(options)
}
