import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import TsEslint from '@typescript-eslint/eslint-plugin';
import TsEslintParser from '@typescript-eslint/parser';

import StylisticPlugin from '@stylistic/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';

import { fileURLToPath } from 'url';
import path from 'path';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    // Generic Config
    {
        ignores: [
            '**/*.spec.ts',
            '/dist/',
            '**/.angular/',
            '**/dist/',
            '**/log/**',
            'esbuild*.mjs',
        ],
    },
    {
        plugins: {
            '@typescript-eslint': TsEslint,
        },
    },
    js.configs.recommended,
    StylisticPlugin.configs['recommended-flat'],
    {
        files: [
            '**/*.ts',
            '**/*.js',
            '**/*.mjs',
        ],
        languageOptions: {
            ecmaVersion: 2021,
        },
        plugins: {
            ...compat.plugins(...[
                'ioc',
                'only-warn',
            ]),
            'stylistic': StylisticPlugin,
            '@stylistic': stylistic,
        },
        rules: {
            // Integrated options
            'eol-last': 'off',
            'id-denylist': 'off',
            'id-match': 'off',
            'prefer-promise-reject-errors': 'off',
            'no-prototype-builtins': 'off',
            'max-len': ['off', {
                code: 140,
            }],
            'no-console': ['warn', {
                allow: [
                    'log',
                    'warn',
                    'dir',
                    'timeLog',
                    'assert',
                    'clear',
                    'count',
                    'countReset',
                    'group',
                    'groupEnd',
                    'table',
                    'dirxml',
                    'groupCollapsed',
                    'Console',
                    'profile',
                    'profileEnd',
                    'timeStamp',
                    'context',
                ],
            }],
            'no-empty': 'off',
            'no-mixed-operators': 'warn',
            '@stylistic/no-multiple-empty-lines': ['warn', {
                max: 4,
                maxEOF: 0,
            }],
            'no-return-assign': 'off',
            'no-unused-vars': 'off',
            'no-shadow': 'off',
            'no-underscore-dangle': 'off',
            'no-use-before-define': 'off',
            'no-useless-constructor': 'off',
            'no-useless-escape': 'off',
            'no-undef': 'off',
            'prefer-const': 'off',
            'sort-imports': ['warn', {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                allowSeparatedGroups: true,
            }],
            'spaced-comment': ['warn', 'always', {
                markers: ['/'],
                exceptions: ['/'],
            }],
            'no-eval': 'warn',
            'no-unexpected-multiline': 'off',
            'curly': ['warn', 'multi-or-nest'],
            'eqeqeq': ['off', 'smart'],
            'radix': 'warn',

            // Stylistic options
            '@stylistic/arrow-parens': ['error', 'as-needed'],
            '@stylistic/brace-style': ['warn', '1tbs'],
            '@stylistic/semi': ['warn', 'always'],

            '@stylistic/dot-notation': 'off',
            '@stylistic/explicit-member-accessibility': ['off', {
                accessibility: 'explicit',
            }],
            '@stylistic/indent': ['warn',
                4,
                { MemberExpression: 1 },

            ],
            '@stylistic/indent-binary-ops': ['warn', 4],
            '@stylistic/member-delimiter-style': ['warn', {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            }],
            '@stylistic/method-signature-style': 'off',
            '@stylistic/no-empty-function': 'off',
            '@stylistic/no-extraneous-class': 'off',
            '@stylistic/no-inferrable-types': ['off', {
                ignoreParameters: true,
            }],
            '@stylistic/no-useless-constructor': 'off',
            '@stylistic/quotes': ['warn', 'single'],
            '@stylistic/space-before-function-paren': 'off',
            '@stylistic/strict-boolean-expressions': 'off',
            '@stylistic/type-annotation-spacing': ['warn', {
                before: false,
                after: true,
            }],
            '@stylistic/no-throw-literal': 'off',


            '@stylistic/comma-dangle': ['warn', {
                objects: 'always-multiline',
                arrays: 'always-multiline',
            }],
            '@stylistic/operator-linebreak': ['warn', 'before'],
        },
    },
    {
        files: [
            '**/*.ts',
            '**/*.js',
            '**/*.mjs',
        ],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                console: true,
                require: true,
            },
        },
    },
    // {
    //     files: [
    //         '/client/',
    //
    //     ],
    //     languageOptions: {
    //         sourceType: 'ES2022',
    //         globals: {
    //             ...globals.browser,
    //             console: true,
    //         },
    //     },
    // },
    // // Angular config
    // {
    //     files: [
    //         '*.component.html',
    //     ],
    //     plugins: {
    //         '@angular-eslint/template': AngularEslint,
    //     },
    //     rules: AngularEslint.configs.recommended,
    // },

    // Typescript config
    {
        ignores: [
            'esbuild*.mjs',
            'eslint.config.js',
        ],
        plugins: {
            '@typescript-eslint': TsEslint,
        },
        languageOptions: {
            parser: TsEslintParser,
            parserOptions: {
                project: [
                    './tsconfig.json',
                    // './client/tsconfig.json',
                    // './server/tsconfig.json',
                ],
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/naming-convention': ['warn', {
                selector: 'variable',
                format: [
                    'camelCase',
                    'UPPER_CASE',
                ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            }],
            '@typescript-eslint/no-shadow': ['warn', {
                hoist: 'all',
            }],
            '@typescript-eslint/no-unused-vars': ['warn', {
                args: 'none',
                ignoreRestSiblings: true,
            }],
            '@typescript-eslint/restrict-template-expressions': 'warn',
            '@typescript-eslint/no-var-requires': 'warn',
            '@typescript-eslint/restrict-plus-operands': 'warn',
        },
    },
];
