module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    "requireConfigFile": false,
  },
  extends: [
    '@nuxtjs'
  ],
  plugins: [
    "nuxt"
  ],
  rules: {
    'vue/no-v-html': 'off',
    'object-curly-spacing': [1, 'always'],
    'array-bracket-spacing': [1, 'always'],
    'no-console': [0, 'off'],
    'vue/comment-directive':'off',
    'new-cap':'off',
    'vue/multi-word-component-names': 0
  }
}