// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import eslint from '@eslint/js';
import { dirname } from "path";
import { fileURLToPath } from "url";

import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat allows legacy "extends" configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // --- Next.js / Web rules ---
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  prettier,
  {
    files: ["apps/web/**/*.{ts,tsx,js,jsx}"],
    ...compat.extends(
      "next/core-web-vitals",
      "next/typescript",
    ),
    rules: {
      "@typescript-eslint/no-empty-function": "warn",
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "@next/next/no-html-link-for-pages": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      // "no-var": "error",
      "import/no-extraneous-dependencies": "warn",
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.next/',
      '**/*.d.ts',
    ],
  },
];
