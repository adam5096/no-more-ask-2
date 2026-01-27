# 分層架構審查指引

基於 `.agent/workflows/construction/decoupling-architecture.md` 與 `nitro/bff-paths.md`。

---

## 層次職責

```
┌─────────────────────────────────────┐
│  UI 層 (Vue Components)             │ ← 只處理交互與顯示
├─────────────────────────────────────┤
│  邏輯層 (Composables)               │ ← 封裝業務行為與狀態
├─────────────────────────────────────┤
│  代理層 (Nitro BFF)                 │ ← 隔離外部 API
└─────────────────────────────────────┘
```

---

## 檢查項目

### 1. UI 層規範

**必須檢查**：
- [ ] 組件內是否直接呼叫 `$fetch`？ → ❌ 違規
- [ ] 組件是否只負責呼叫 Composable 的 Actions？
- [ ] 狀態同步是否在 Composable 內完成？

**錯誤範例**：
```vue
<!-- ❌ UI 層直接處理 API -->
<script setup>
const handleLogin = async (data) => {
  const res = await $fetch('/api/v1/auth/login', { body: data })
  auth.setToken(res.token) // 在 UI 層處理狀態
}
</script>
```

**正確範例**：
```vue
<!-- ✅ 委託給 Composable -->
<script setup>
const auth = useAuth()

const handleLogin = async (data) => {
  await auth.login(data) // Composable 內部處理一切
}
</script>
```

---

### 2. 邏輯層規範

**必須檢查**：
- [ ] 非同步 API 請求是否封裝在 Composable 的 `async` 函式中？
- [ ] API 成功後是否在 Composable 內完成狀態更新？
- [ ] 是否透過參數注入依賴（可測試性）？

**正確範例**：
```typescript
// useAuth.ts
export const useAuth = () => {
  const token = useState<string | null>('token', () => null)
  
  const login = async (credentials: Credentials) => {
    const res = await $fetch('/api/v1/auth/login', { 
      method: 'POST', 
      body: credentials 
    })
    token.value = res.token // ✅ 狀態同步封裝
    return res
  }
  
  return { token, login }
}
```

---

### 3. BFF 路徑規範

**命名規則**：`[domain]/[context]/[action-or-resource]`

**必須檢查**：
- [ ] 是否使用複數名詞？（`/api/rescue-requests`）
- [ ] 路徑嵌套是否不超過 2 層？
- [ ] 是否使用適當的 HTTP 方法？

| 操作類型 | HTTP 方法 | 範例 |
|----------|-----------|------|
| 簡單狀態變更 | PATCH | `PATCH /api/rescue-requests/[id]` |
| 複雜流程 | POST | `POST /api/response-kit/generate` |
| 取得資源 | GET | `GET /api/helpers/[id]/details` |

---

## 審查時的判斷

| 情況 | 判定 |
|------|------|
| 組件直接呼叫 `$fetch` | ❌ 需要修改 |
| 組件內更新全域狀態 | ❌ 需要修改 |
| Composable 未封裝狀態更新 | ⚠️ 建議改進 |
| BFF 路徑使用單數名詞 | ⚠️ 建議改進 |
| BFF 路徑嵌套超過 2 層 | ⚠️ 建議改進 |
