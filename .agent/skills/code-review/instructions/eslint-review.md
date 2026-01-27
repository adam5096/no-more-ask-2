# ESLint 審查指南

## 型別安全

### 禁用 any

- ❌ **不可使用** `any` 類型
- ✅ 使用具體型別或 `unknown` + type guard

```ts
// ❌ 錯誤
const errors = ref<any>({})
catch (error: any) { ... }

// ✅ 正確
interface FieldErrors { email?: string[] }
const errors = ref<FieldErrors>({})

catch (err: unknown) {
  const error = toApiError(err)
}
```

### 未使用變數

- ❌ **不可有** 未使用的變數或 import
- ✅ 移除或加 `_` 前綴表示刻意忽略

```ts
// ❌ 錯誤
const { token, ...rest } = response  // token 未使用

// ✅ 正確
const { token: _token, ...rest } = response  // 明確忽略
// 或直接
const { email, userId } = response  // 只取需要的
```

## 錯誤處理

### 統一錯誤型別

- 使用 `types/api-error.ts` 中的 `toApiError()` 轉換
- catch 區塊使用 `unknown` 而非 `any`

```ts
import { toApiError } from '~/types/api-error'

try {
  // ...
} catch (err: unknown) {
  const error = toApiError(err)
  console.error(error.message)
}
```

## 檢查清單

| 項目 | 規則 | 嚴重度 |
|------|------|--------|
| 禁用 any | `@typescript-eslint/no-explicit-any` | ❌ error |
| 未使用變數 | `@typescript-eslint/no-unused-vars` | ❌ error |
| Dynamic delete | `@typescript-eslint/no-dynamic-delete` | ✅ 允許 |

## 自動修復

部分問題可自動修復：

```bash
pnpm run lint --fix
```
