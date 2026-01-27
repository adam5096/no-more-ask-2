---
description: 為 Nuxt 3 專案設定 ESLint
---

# 設定 ESLint

為 Nuxt 3 專案新增 ESLint 配置的標準流程。

## 前置條件

- 專案使用 pnpm
- 專案使用 Nuxt 3 + TypeScript

## 步驟

### STEP 1: 安裝依賴

```bash
// turbo
pnpm add -D @nuxt/eslint eslint typescript
```

### STEP 2: 更新 nuxt.config.ts

加入 `@nuxt/eslint` 模組並設定 stylistic 為 false：

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      stylistic: false // 關閉格式規則，只檢查邏輯
    }
  }
})
```

### STEP 3: 建立 eslint.config.mjs

參考 `eslint.config.mjs` 範本建立配置檔：

```js
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // 忽略測試檔案（由 vitest 處理）
  {
    ignores: ['**/*.test.ts', '**/*.spec.ts']
  },
  // 規則覆寫
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      // 禁用 any
      '@typescript-eslint/no-explicit-any': 'error',
      // 禁止未使用變數，_ 開頭的除外
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 允許 dynamic delete（常見於表單錯誤處理）
      '@typescript-eslint/no-dynamic-delete': 'off',
      // 關閉 Vue 格式規則
      'vue/attributes-order': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      'vue/no-multiple-template-root': 'off'
    }
  }
)
```

### STEP 4: 加入 lint script

在 `package.json` 的 scripts 加入：

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

### STEP 5: 執行 nuxt prepare

```bash
// turbo
pnpm run postinstall
```

### STEP 6: 執行 lint 並修復錯誤

```bash
// turbo
pnpm run lint
```

若有錯誤，根據錯誤訊息逐一修復。常見修復：
- `no-explicit-any`: 用具體型別取代 any
- `no-unused-vars`: 移除未使用變數或加 `_` 前綴

### STEP 7: 更新 CI（可選）

若專案有 CI，在 `.github/workflows/ci.yml` 加入 lint step：

```yaml
- name: Lint
  run: pnpm run lint
```

放在 `pnpm run postinstall` 之後。

## 驗證

- [ ] `pnpm run lint` 通過
- [ ] `pnpm run test` 通過（確保沒有 breaking changes）
- [ ] CI 通過
