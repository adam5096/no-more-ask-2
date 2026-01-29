---
description: Server & Nitro 審查規範
---

# Server & Nitro Review Instructions

針對 Server-side (Nitro/API) 的開發，應遵循以下審查準則：

## 1. BFF 命名與路徑規範
- **命名規範**：應優先適用 RESTful 風格命名，如 RESTful 語意已經無法完整表達請求資源意圖，再考慮使用動詞命名。
- **資源命名**：使用複數名詞 (例如 `/api/users`, `/api/rescue-requests`)。
- **結構分層**：遵循 `[domain]/[context]/[action-or-resource]`。
- **動詞規範**：
    - 簡單更新使用 `PATCH`。
    - 複雜流程或非簡單更新（如 AI 生成）使用 `POST`。

## 2. HATEOAS 與導航 (Actions API) (本檢核為可選項，等待有分權使用者需求的時候再加入考慮)
- **物理隔離**：區分業務資料 (Data) 與行為導航 (Metadata)。
- **底線前綴**：導航連結應放入 `_links` 物件中，遵循 HAL 標準。
- **狀態機管理**：連結應由 Server 端的 `utils/LinkBuilder` 根據資源狀態生成，而非由前端決定權限。

## 3. Payload 優化 (Payload Minimization)
- **UI-Ready JSON**：回傳的資料格式應直接供 UI 使用，不在前端做複雜轉換。
- **資源聚合**：BFF 層應完成必要的關聯資源聚合（ 如 `Standard (1:3)` 頁面類型，比例值非永久固定，應根據問專案需求調整 ）。
- **隱藏後端複雜度**：不應暴露原始資料庫結構或過多無效欄位。

## 4. 安全與驗證
- **JWT 認證**：確認 API endpoint 是否正確應用了認證過濾（ 如果不是全域攔截 ）。
- **錯誤格式**：回傳統一的錯誤回應 JSON 格式，包含適當的 HTTP 狀態碼。

## 5. 代碼結構
- **Server Utils**：重複使用的邏輯（如 Link Builder, Data Formatter）應放入 `server/utils`。
- **單一職責**：每個 event handler 應專注於處理單一 API 請求。
