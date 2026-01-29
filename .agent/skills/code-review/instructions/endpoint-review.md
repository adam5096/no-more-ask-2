---
description: 端點治理 (Endpoint Governance) 審查規範
---

# Endpoint Governance Review Instructions

確保 API 端點定義符合安全性、物理隔離與 SSOT 原則。

## 1. 環境隔離規範 (Environment Isolation)
- **物理隔離**：
    - 前端與 BFF 溝通的路徑 (`/api/v1/...`) 必須定義在 `utils/endpoints.ts`。
    - BFF 往後端內部溝通的路徑 (Remote API) 必須定義在 `server/utils/endpoints.ts`。
- **防止洩漏**：
    - 嚴禁在 `utils/` (Isomorphic) 中定義任何包含後端真實 IP、秘密 API Key 或內部資源路徑的常數。

## 2. 命名與結構 (Naming & Structure)
- **SSOT 原則**：所有路徑應統一由 `endpoints.ts` 管理，嚴禁在元件或 API Handler 中寫死 (Hardcode) 字串路徑（除非是極少見的外部連結）。
- **類型安全**：導出的常數應使用 `as const`，並提供對應的型別導出（如 `RemoteEndpoint`）。

## 3. 使用方式審查 (Usage Review)
- **前端使用**：只能 import `API_ENDPOINTS`。
- **後端使用**：可同時使用 `API_ENDPOINTS` (用於生成動態連結) 與 `REMOTE_ENDPOINTS`。

## 4. 判斷準則
| 情況 | 判定 |
|------|------|
| 在 `utils/` 中發現遠端內部路徑 | ❌ 嚴重安全違規，必須修正 |
| 在元件中寫死 `/api/v1/...` 字串 | ⚠️ 建議改進（應改用 `API_ENDPOINTS`） |
| `endpoints.ts` 未使用 `as const` | ⚠️ 建議改進 |
