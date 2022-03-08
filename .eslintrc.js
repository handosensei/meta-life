module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  rules: {
    'vue/no-v-html': 'off',
    'object-curly-spacing': [1, 'always'],
    'array-bracket-spacing': [1, 'always'],
    'no-console': [0, 'off'],
    'vue/comment-directive':'off',
    'new-cap':'off'
  }
}
