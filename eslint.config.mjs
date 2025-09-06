import {fixupConfigRules} from '@eslint/compat';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import google from 'eslint-config-google';
import unusedImports from 'eslint-plugin-unused-imports';
import esLintImport from 'eslint-plugin-import';
import globals from 'globals';
import tsEslint from 'typescript-eslint';


const config = [
  {
    ignores: [
      '**/.yarn',
      '**/logs/**/*',
      '**/.eslintcache',
      '**/node_modules/**/*',
      '**/dist/**/*',
    ],
  },
  ...fixupConfigRules({
    rules: Object.keys(google.rules).reduce((acc, key) => {
      if (key !== 'valid-jsdoc' && key !== 'require-jsdoc') {
        acc[key] = google.rules[key];
      }
      return acc;
    }, {}),
  }),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@stylistic': stylistic,
      '@typescript-eslint': tsEslint.plugin,
      'import': esLintImport,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off',
      '@stylistic/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': ['error', {
        varsIgnorePattern: '^[_]+$',
        argsIgnorePattern: '^[_]+$',
        ignoreRestSiblings: true,
      }],
      'unused-imports/no-unused-imports': ['error'],
      'indent': 'off',
      '@stylistic/indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'max-len': ['error', {
        code: 119,
      }],
      'no-console': ['error', {
        allow: ['info', 'warn', 'error', 'debug'],
      }],
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-restricted-imports': ['error', {
        patterns: [{
          group: ['.*'],
          message: 'Only absolute import, such as `@/const/auth` is allowed.',
        },
        {
          group: ['lodash/uniq'],
          message: 'Use `toUnique()` instead.',
        },
        {
          group: ['lodash/groupBy'],
          message: 'Use `Map.groupBy()` instead.',
        }],
      }],
      '@typescript-eslint/no-unsafe-unary-minus': ['error'],
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal'],
        'pathGroups': [{
          pattern: 'react',
          group: 'external',
          position: 'before',
        }],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      }],
      'import/newline-after-import': ['error', {
        count: 2,
      }],
      'no-multiple-empty-lines': ['error', {max: 2, maxEOF: 0, maxBOF: 0}],
      '@stylistic/object-curly-spacing': ['error', 'never'],
      '@stylistic/semi': ['error'],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'comma',
          requireLast: true,
        },
      }],
      '@stylistic/type-annotation-spacing': ['error', {
        before: true,
        after: true,
        overrides: {
          colon: {
            before: false,
            after: true,
          },
          arrow: {
            before: true,
            after: true,
          },
        },
      }],
      'space-in-parens': ['error', 'never'],
      'quote-props': ['error', 'consistent-as-needed', {
        keywords: false,
        unnecessary: true,
      }],
      '@stylistic/arrow-spacing': ['error', {
        before: true,
        after: true,
      }],
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        tuples: 'always-multiline',
        enums: 'always-multiline',
        generics: 'ignore',
      }],
      '@stylistic/space-unary-ops': ['error', {
        words: true,
        nonwords: false,
      }],
      '@stylistic/space-infix-ops': ['error'],
      'no-trailing-spaces': 'error',
      'padding-line-between-statements': [
        'error',
        {blankLine: 'always', prev: '*', next: 'cjs-export'},
        {blankLine: 'always', prev: '*', next: 'export'},
        {blankLine: 'always', prev: 'const', next: 'cjs-export'},
        {blankLine: 'always', prev: '*', next: 'export'},
      ],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'function-call-argument-newline': ['error', 'consistent'],
      'operator-linebreak': ['error', 'after'],
    },
  },
];

export default config;
