// @ts-check

import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default tseslint.config(
  {
    ignores: ['**/node_modules/', '**/build/', '**/.next'],
  },
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  tseslint.configs.recommended,
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
    },

    rules: {
      'prettier/prettier': ['error'],
    },
  },
  // {
  //   files: ['packages/drama-led-ui/**'],
  //   // ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  //   plugins: {
  //     // next: nextWebCoreVitals.plugins,
  //   }
  // },
);
