module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  ignorePatterns: ['/bin', '/build'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'operator-linebreak': 'off',
    'no-useless-constructor': 'off',
    'no-param-reassign': 'off',
    'max-classes-per-file': 'off',
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'max-len': ['warn', { code: 120 }],
    'unused-imports/no-unused-imports': 'warn',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'lines-between-class-members': ['warn'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  plugins: [
    'jest',
    'unused-imports',
  ],
};
