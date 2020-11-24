module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'max-len': ['error', { code: 200 }],
    'no-continue': 'off',
    'prefer-promise-reject-errors': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'newline-per-chained-call': 'off',
  },
};
