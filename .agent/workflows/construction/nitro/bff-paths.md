---
description: BFF 路徑設計文檔
---

> **核心原則**：扁平化結構（嵌套 <2 層）、複數名詞、BFF 層完成聚合與轉換。
> **命名規範**：`[domain]/[context]/[action-or-resource]`

---

## API 設計準則

### 資源命名與結構
- **複數資源**：如 `/api/rescue-requests`、`/api/helpers`。
- **簡單狀態變更 (PATCH)**：適用於切換開關、單一屬性更新。
  - `PATCH /api/rescue-requests/[id]` + `{ status: 'completed' }`
- **複雜流程 (POST)**：涉及多資源協調、計算或非簡單更新。
  - `POST /api/response-kit/generate` (AI 生成)
  - `POST /api/diagnostic/submit-answers` (計算報告)

---

## 頁面複雜度分析

| 頁面類型 | 描述 | 常見路徑與說明 |
|----------|------|----------------|
| **Simple (1:1)** | 單路徑對應 | `/api/response-kit/generate` |
| **Standard (1:3)** | 聚合主要/次要資源 | `/api/rescue-requests/[id]/details` (含 Helper 與地圖) |
| **Complex (1:N)** | 獨立區塊多路徑 | `/api/dashboard/init-data` + 列表非同步載入 |

---

## BFF 路徑詳細設計

### 用戶與 Helper 相關
- **`GET /api/users/profile`**: 獲取個人資料清單。
- **`PATCH /api/users/profile`**: 更新 `nickname`, `avatar`, `location`, `role` (切換角色)。
- **`GET /api/helpers/[id]/details`**: 聚合 Helper 基本資料 + 歷史案件 + 評價。
- **`GET /api/helpers`**: 列表篩選 (`skills`, `location`, `maxDistance`)。
- **`POST /api/helpers`**: 註冊成為 Helper (`skills`, `bio`, `hourlyRate`)。
- **`PATCH /api/helpers/[id]`**: 更新接案狀態 (`status: 'online'|'offline'|'busy'`) 或個人檔案。

### 救援請求 (RescueRequest)
- **`GET /api/rescue-requests/[id]/details`**: 聚合 Request + 匹配 Helper + 地圖位置。
- **`POST /api/rescue-requests`**: 建立請求 (`requestType`, `stressLevel`, `location`)。
- **`GET /api/rescue-requests`**: 儀表板列表篩選 (`status`, `page`, `limit`)。
- **`PATCH /api/rescue-requests/[id]`**: 狀態更新 (`status: 'matched'|'completed'`) 或評價 Helper (`rating`, `review`)。

### 診斷與腳本 (Diagnostic & ResponseKit)
- **`POST /api/response-kit/generate`**: `inputQuestion`, `tone` -> `script`。
- **`POST /api/diagnostic/start-test`**: 初始化測驗 (`testType`)。
- **`POST /api/diagnostic/submit-answers`**: 提交並生成報告。
- **`GET /api/diagnostic-reports/[id]/details`**: 聚合報告與處方箋。

### 社群與互動 (Venting & Gathering)
- **`GET /api/venting/feed`**: 同溫層貼文瀑布流。
- **`POST /api/venting/posts`**: 發布貼文 (`content`, `isAnonymous`, `location`)。
- **`PATCH /api/venting/posts/[id]`**: 按讚 (`likes`) 或新增留言 (`comment`)。
- **`GET /api/gatherings/[id]/details`**: 聚合聚會資料 + 參與者 + 地圖。
- **`POST /api/gatherings`**: 發起聚會 (`title`, `location`, `scheduledAt`)。
- **`PATCH /api/gatherings/[id]`**: 加入/退出 (`action: 'join'|'leave'`) 或取消 (`status: 'cancelled'`)。

### 其他輔助路徑
- **地圖**: `/api/map/init-data` (初始縮放/中心點), `/api/map/[layer-name]` (救援點、Heatzones、Sanctuaries)。
- **通知**: `GET /api/notifications/list`, `PATCH /api/notifications/[id]` (mark read), `PUT /api/notifications/preferences`。
- **邊界清單**: `GET /api/boundary-manual/details`, `PUT /api/boundary-manual/update`。
- **儀表板聚合**: `GET /api/dashboard/init-data` (用戶統計 + 狀態)。

---

## 檢查清單與對齊事項
1. **隱藏後端複雜度**：UI-ready JSON，不做多餘運算。
2. **命名模式**：`[domain]/[context]/[action]`。
3. **對齊點**：錯誤回應格式、JWT 認證、地理空間查詢實作方式、分頁機制。

---
**版本**：v1.1 (精簡版) | **更新**：2024

