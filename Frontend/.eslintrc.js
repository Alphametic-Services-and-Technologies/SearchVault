module.exports = {
   env: {
      browser: true,

      es2021: true,
   },

   extends: [
      'airbnb',

      'airbnb-typescript',

      'airbnb/hooks',

      'plugin:react/recommended',

      'plugin:@typescript-eslint/recommended',

      'plugin:prettier/recommended',
   ],

   overrides: [],

   parser: '@typescript-eslint/parser',

   parserOptions: {
      ecmaVersion: 'latest',

      sourceType: 'module',

      project: './tsconfig.json',
   },

   plugins: ['react', '@typescript-eslint', 'prettier'],

   rules: {
      'linebreak-style': 0,
      'prettier/prettier': 0,
      'no-unused-expressions': 0,
      'react/jsx-props-no-spreading': 0,
      '@typescript-eslint/default-param-last': 0,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/no-explicit-any': 0,
      'jsx-a11y/no-noninteractive-element-interactions': 0,
      'react/destructuring-assignment': 0,
      'react/no-array-index-key': 0,
      'no-console': 'error',
      'no-nested-ternary': 0,
   },
};
