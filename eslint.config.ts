import js from '@eslint/js'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
// v14 exposes a wrapper that wires the Vue and TypeScript configs together;
// the package has no default export holding the configs themselves.
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'

export default defineConfigWithVueTs(
  globalIgnores([
    'dist/**',
    // Output of the retired create-react-app build, and the React source it was
    // built from. Both are kept only for reference.
    'build/**',
    'legacy_react/**',
    'coverage/**',
    'node_modules/**'
  ]),

  js.configs.recommended,
  // `flat/essential` is correctness-only. The stylistic rules in
  // `flat/recommended` overlap with Prettier and would fight it over template
  // formatting, so formatting is left entirely to Prettier.
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    files: ['**/*.{ts,vue}'],
    rules: {
      // Underscore-prefixed parameters are declared for their types only.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },

  {
    files: ['scripts/**/*.mjs', '*.config.ts'],
    languageOptions: {
      globals: { ...globals.node }
    }
  },

  // Must stay last so it can switch off anything stylistic above it.
  skipFormatting
)
