import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import baseConfig from '../../eslint.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...baseConfig,
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        React: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@next/next/no-html-link-for-pages': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': 'error',
    },
  },
];
