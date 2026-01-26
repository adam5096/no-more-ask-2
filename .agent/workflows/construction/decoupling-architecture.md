---
description: 業務邏輯與介面解耦架構指南
---

# 業務邏輯與介面解耦架構指南

本規範定義了專案中 **UI 層 (Vue Components)** 與 **邏輯層 (Composables)** 以及 **代理層 (BFF)** 之間的解耦標準，旨在確保系統的可維護性、可測試性與認知一致性。

## 層次職責定義

### 1. 代理層 (Nitro BFF)
- **職責**：作為外部後端的代理，隔離硬編碼的遠端位址。
- **規範**：
  - 嚴禁在 `server/api` 中硬編碼外部路徑。
  - 必須將外部端點集中於 `server/utils/remote-endpoints.ts`。
  - 統一使用 `$remoteFetch` 進行通訊，支援 Base URL 的自動注入。

### 2. 邏輯層 (Composables)
- **職責**：封裝業務行為（Actions）與狀態管理（State）。
- **規範**：
  - **行為封裝**：所有非同步的 API 請求（如 login, register）必須封裝在 Composable 的 `async` 函式中。
  - **內部化狀態更新**：API 請求成功後，應在 Composable 內部完成 `state` (如 `token`, `user`) 的更新。
  - **發起人一致性**：確保瀏覽器網路面板中的 Initiator 統一指向邏輯層檔案。

### 3. UI 層 (Vue Components)
- **職責**：處理使用者交互、顯示資料、切換 UI 狀態。
- **規範**：
  - **禁止直接請求**：組件內嚴禁直接呼叫 `$fetch` 存取外部 API 或 BFF 介面。
  - **委託行為**：組件僅負責呼叫 Composable 暴露的 Actions（如 `auth.login(data)`）。
  - **狀態反饋**：組件僅需負責「載入中 (isLoading)」、「錯誤顯示 (Error handling)」等顯示邏輯。

---

## 實作模式對比

### ❌ 錯誤模式 (混亂職責)
組件層直接管 API，導致 Initiator 混亂，且邏輯無法重用。
```vue
<!-- AuthOverlay.vue -->
<script setup>
const handleLogin = async (data) => {
  const res = await $fetch('/api/v1/auth/login', { body: data }) // ❌ 硬編碼路徑
  auth.setToken(res.token) // ❌ 在 UI 層處理狀態同步
}
</script>
```

### ✅ 正確模式 (徹底解耦)
組件只提供資料，由邏輯層決定「如何做、存哪裡」。
```typescript
// useAuth.ts (邏輯層)
export const useAuth = () => {
  const login = async (credentials) => {
    const res = await $fetch('/api/v1/auth/login', { method: 'POST', body: credentials })
    token.value = res.token // ✅ 邏輯與狀態同步封裝
    return res
  }
}
```

## 認知保護 (Cognitive Preservation)
- 當新同事加入時，只需閱讀 Composable 的介面（Interface），而不需理解底層 API 結構。
- 當 API 規格變動時，只需修改 Composable 的一個 Action，所有引用該功能的 UI 組件將自動同步。

---
**版本**：v1.0 | **類型**：Architecture Standard
