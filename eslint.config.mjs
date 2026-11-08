import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'public/**', 'src/assets/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'no-lone-blocks': 'off',
      'no-extend-native': 'off',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
      ],
      'no-debugger': 'off'
    }
  },
  {
    name: 'app/vue-files',
    files: ['**/*.vue'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: {
          js: 'espree',
          '<template>': 'espree'
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/no-v-model-argument': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
      ],
      'no-debugger': 'off'
    }
  },
  {
    // 构建期脚本运行在 Node，需要 node 全局；src 下的应用代码仍按浏览器环境校验。
    name: 'app/node-scripts',
    files: ['*.{js,mjs}', 'scripts/**/*.mjs', 'tests/**/*.js'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/build/*.js',
      '**/src/assets/**',
      '**/public/**',
      '**/src/types/auto-imports.d.ts'
    ]
  }
]
