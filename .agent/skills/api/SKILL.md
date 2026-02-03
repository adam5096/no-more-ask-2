---
name: api
description: 負責 API 設計治理、BFF 路徑規範與 Payload 優化方針
---

# API Design Skill

本技能提供 API 設計的執行步驟與治理規範，確保 API 設計符合 RESTful 原則、BFF 架構與 HATEOAS 標準。

---

## 使用時機 (When to Use)

在以下情境中使用此 Skill：
- `/development-workflow` Step 2 (SDD) - 進行 API 設計時
- 新增或修改 BFF 端點時
- Code Review 時驗證 API 設計規範

---

## 執行步驟 (Execution Steps)

### Step 1: 確認 API 設計範圍

1. **識別資源 (Resource Identification)**
   - 確認要設計的核心資源（Objects）
   - 參考 ORCA Discovery 文件中的 Objects 定義
   - 確認資源之間的關係（Relationships）

2. **評估頁面複雜度**
   - Simple (1:1): 單一資源，單一端點
   - Standard (1:3): 聚合 2-3 個相關資源
   - Complex (1:N): 多個獨立區塊，多端點非同步載入

### Step 2: 設計 BFF 路徑

參考 `references/bff-paths.md` 進行路徑設計：

1. **命名規範**
   - 使用複數名詞：`/api/rescue-requests`
   - 遵循模式：`[domain]/[context]/[action-or-resource]`
   - 嵌套層級 < 2 層

2. **HTTP 方法選擇**
   - `GET`: 獲取資源
   - `POST`: 建立資源或複雜操作（如 AI 生成）
   - `PATCH`: 簡單狀態變更（如切換開關）
   - `DELETE`: 刪除資源

3. **檢查清單**
   - [ ] 路徑符合命名規範
   - [ ] HTTP 方法語義正確
   - [ ] 回傳 UI-ready JSON（不做多餘運算）
   - [ ] 錯誤回應格式統一

### Step 3: 實作 HATEOAS（選用）

若 API 涉及狀態機或複雜業務流程，參考 `references/hateoas.md`：

1. **建立狀態機引擎**
   - 在 `server/utils/` 建立 Link Builder
   - 根據資源狀態生成可用的 Actions

2. **注入導航元數據**
   - 在 API 回傳中加入 `_links` 物件
   - 遵循 HAL 標準

3. **前端聲明式渲染**
   - 前端根據 `_links` 決定顯示哪些按鈕
   - 避免在前端寫業務邏輯判斷

### Step 4: Payload 優化（選用）

若 API 回傳資料過大，參考 `/performance` Skill 的 Payload 優化策略。

### Step 5: 驗證與文件

1. **自我檢查**
   - 執行 `/code-review-checklist` 驗證 API 設計
   - 確認符合專案的 API 治理規範

2. **更新文件**
   - 在 TypeScript Types 中定義 API Contract
   - 更新 API 文件或 Swagger/OpenAPI 定義

---

## 參考資源 (References)

### 內部參考
- `references/bff-paths.md` - BFF 路徑設計規範
- `references/hateoas.md` - HATEOAS 架構指南

### 相關 Skill/Workflow
- `/development-workflow` - 開發流程（上游）
- `/code-review-checklist` - Code Review（下游）
- `/performance` - 效能優化 Skill（Payload 優化）

### 外部資源
- [RESTful API 設計指南](https://restfulapi.net/)
- [HAL - Hypertext Application Language](http://stateless.co/hal_specification.html)

---

## 常見問題 (FAQ)

**Q: 何時使用 POST 而非 PATCH？**
A: 當操作涉及多資源協調、計算或非簡單更新時使用 POST（如 AI 生成、診斷報告計算）。

**Q: 是否所有 API 都需要實作 HATEOAS？**
A: 不是。僅在涉及複雜狀態機或業務流程時才需要。簡單的 CRUD 操作不需要。

**Q: BFF 層應該做多少資料轉換？**
A: BFF 應該回傳 UI-ready JSON，避免前端做複雜運算。但不要在 BFF 做過多業務邏輯，保持為「聚合層」。

---

**版本**: v2.0  
**最後更新**: 2026-02-03  
**維護者**: AI + Developer
