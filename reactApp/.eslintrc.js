module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    semi: 2,
    "react/prop-types": 2,
    camelcase: "error",
    indent: ["error", 2, { "SwitchCase": 1 }]
  },
  globals: {
    process: true
  }
};
