// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // 忽略測試檔案（由 vitest 處理）
  {
    ignores: ['**/*.test.ts', '**/*.spec.ts']
  },
  // 寬鬆規則覆寫
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      // 禁用 any（用戶要求）
      '@typescript-eslint/no-explicit-any': 'error',
      // 禁止未使用變數，_ 開頭的除外
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 允許 dynamic delete（常見於表單錯誤處理）
      '@typescript-eslint/no-dynamic-delete': 'off',
      // 關閉 Vue 屬性順序檢查（太囉嗦）
      'vue/attributes-order': 'off',
      // 關閉多字組件名稱要求（Nuxt 頁面常用單字）
      'vue/multi-word-component-names': 'off',
      // 關閉 HTML self-closing 檢查（格式問題）
      'vue/html-self-closing': 'off',
      // 關閉 layout slot 限制
      'vue/no-multiple-template-root': 'off'
    }
  }
)
