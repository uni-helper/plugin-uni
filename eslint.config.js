import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
}, {
  files: ['test/**/*.ts'],
  rules: {
    'ts/no-require-imports': 'off',
  },
}, {
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
  },
})
