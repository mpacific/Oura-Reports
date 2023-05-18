module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: false,
    browser: true,
    jquery: true,
  },
  globals: {
    Chart: true,
    jsonData: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: ['error', 2],
    'max-len': 'off',
  },
};
