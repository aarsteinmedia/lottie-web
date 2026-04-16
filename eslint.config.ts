import {
  sheriff, type SheriffSettings, tseslint
} from 'eslint-config-sheriff';
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';

const sheriffOptions: SheriffSettings = {
  'astro': false,
  'jest': false,
  'lodash': false,
  'next': false,
  'playwright': false,
  'react': false,
  'remeda': false,
  'storybook': false,
  'vitest': false
};

const ignores = [
  '**/node_modules/*',
  '**/types/*',
  'tsconfig.json',
  'player.js',
  'player-light.js',
];
const config = defineConfig(
  sheriff(sheriffOptions),
  {
    files: ['**/*.{ts,js}'],
    ignores,
    plugins: { perfectionist },
    rules: {
      '@stylistic/array-element-newline': ['warn', { minItems: 3 }],
      '@stylistic/comma-dangle': ['warn', 'only-multiline'],
      '@stylistic/comma-spacing': 'warn',
      '@stylistic/func-call-spacing': 'warn',
      '@stylistic/function-paren-newline': ['warn', { minItems: 3 }],
      '@stylistic/indent': ['warn', 2],
      '@stylistic/indent-binary-ops': ['warn', 2],
      '@stylistic/key-spacing': 'warn',
      '@stylistic/lines-between-class-members': ['warn', {
        enforce: [
          {
            blankLine: 'always',
            next: 'method',
            prev: 'method'
          }
        ]
      }],
      '@stylistic/no-extra-parens': 'warn',
      '@stylistic/no-multi-spaces': 'warn',
      '@stylistic/no-multiple-empty-lines': 'warn',
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/object-curly-newline': ['warn', {
        minProperties: 3,
        multiline: true
      }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/object-property-newline': 'warn',
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/space-before-blocks': 'warn',
      '@stylistic/space-in-parens': 'warn',
      '@stylistic/type-annotation-spacing': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
      '@typescript-eslint/dot-notation': ['warn', { allowKeywords: false }],
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allowSingleOrDouble',
          selector: 'default',
          trailingUnderscore: 'forbid',
        },
        {
          format: ['camelCase'],
          leadingUnderscore: 'allowSingleOrDouble',
          modifiers: ['const'],
          selector: 'variable',
          trailingUnderscore: 'forbid',
          types: ['string', 'number'],
        },
        {
          format: null,
          leadingUnderscore: 'allowSingleOrDouble',
          selector: 'objectLiteralProperty',
          trailingUnderscore: 'forbid',
        },
        {
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
          selector: 'typeLike',
          trailingUnderscore: 'forbid',
        },
        {
          format: ['PascalCase'],
          leadingUnderscore: 'allowSingleOrDouble',
          prefix: [
            'is',
            'in',
            'are',
            'has',
            'should',
            'can',
            'needs'
          ],
          selector: 'variable',
          trailingUnderscore: 'forbid',
          types: ['boolean'],
        },
        {
          format: null,
          modifiers: ['destructured'],
          selector: 'variable',
        },
        {
          format: null,
          selector: 'typeProperty',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unnecessary-type-parameters': 0,
      '@typescript-eslint/no-unused-vars': [
        'error', {
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': ['error', {
        classes: false,
        functions: false
      }],
      '@typescript-eslint/restrict-template-expressions': [
        'error', { allowNumber: true },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': ['error', { considerDefaultExhaustiveForUnions: true }],
      '@typescript-eslint/unbound-method': 0,
      'arrow-return-style/arrow-return-style': 0,
      'consistent-return': 'warn',
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'fsecond/prefer-destructured-optionals': 0,
      'func-style': 0,
      'import/no-default-export': 'warn',
      'no-else-return': 'warn',
      'no-implicit-coercion': 'warn',
      'no-nested-ternary': 'warn',
      'no-plusplus': 0,
      'no-restricted-globals': ['error',
        'event',
        'fdescribe'],
      'no-restricted-syntax/noAccessModifiers': 0,
      'no-restricted-syntax/noClasses': 0,
      'no-restricted-syntax/noEnums': 0,
      'no-void': 0,
      'one-var': ['warn', 'never'],
      'operator-assignment': 0,
      'perfectionist/sort-classes': 'warn',
      'perfectionist/sort-enums': 'warn',
      'perfectionist/sort-imports': 'warn',
      'perfectionist/sort-interfaces': 'warn',
      'perfectionist/sort-objects': 'warn',
      'simple-import-sort/imports': 0,
      'unicorn/no-array-reduce': ['error', { allowSimpleOperations: true }],
      'unicorn/prefer-query-selector': 0,
      'unicorn/template-indent': 'warn',
    },
  },
  {
    extends: [tseslint.configs.disableTypeChecked],
    files: ['**/*.{js,mjs}'],
    ignores,
  }
);

// eslint-disable-next-line import/no-default-export
export default config;