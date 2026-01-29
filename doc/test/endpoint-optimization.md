# 測試案例：端點環境隔離優化 (Endpoint Optimization)

## 測試環境
- 框架：Nuxt 3 (Nitro)
- 工具：Vitest / Manual Verification

## 1. 架構隔離測試 (Architecture Isolation)
### 1.1 驗證前端無法存取後端端點
- **測試說明**：確保在 `pages/` 或 `components/` 中嘗試 import `REMOTE_ENDPOINTS` 會導致編譯錯誤或 undefined。
- **預期結果**：TypeScript 報錯，且打包後的 client bundle 不含任何 `Remote/` 字串內容。

### 1.2 驗證後端可存取所有端點
- **測試說明**：在 `server/api/` 中 import `REMOTE_ENDPOINTS` 與 `API_ENDPOINTS`。
- **預期結果**：正常運作，類型定義正確。

## 2. 功能正確性測試 (Functional Correctness)
### 2.1 驗證 BFF 路徑一致性
- **測試說明**：檢查 `API_ENDPOINTS.AUTH.LOGIN` 是否仍為 `/api/v1/auth/login`。
- **預期結果**：路徑無誤，前端呼叫正常。

### 2.2 驗證 遠端路徑一致性
- **測試說明**：檢查 `REMOTE_ENDPOINTS.AUTH.LOGIN` 是否仍為 `/Auth/login`。
- **預期結果**：BFF 轉發至內部後端路徑無誤。
