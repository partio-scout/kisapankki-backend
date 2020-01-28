module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    semi: [2, "never"],
    indent: ["error", 2],
    'no-underscore-dangle': ["error", { "allow": ["_id", "__v"] }],
    'no-param-reassign': 0
  },
};
