---
description: 接到一開發需求後的標準開發流程 (DDD -> SDD -> TDD -> Phase)
---

# 開發需求工作流 (Development Workflow)

本工作流旨在確保開發需求從分析到實作皆能對齊專案的 **函數式編程 (Functional Programming)**、**OOUX/ORCA 設計**與**高品質測試**規範。

---

## Step 1. DDD: Domain Driven Development
**目標：盤點、區分需求領域落點，明確業務邊界。**

### 1.1 領域盤點
*   **單一領域**：該需求是否僅涉及現有的單一物件（Object）或領域（Domain）？（例如：僅修改「使用者設定」）。
*   **跨領域綜合**：是否需要結合多個領域知識點？（例如：「救援請求」結合了「地理位置」與「派遣邏輯」）。
*   **未知排查**：若存在模糊不清的領域邊界，請務必先詢問開發人員確認。

### 1.2 OOUX 對齊
*   參考 `/information-architecture` 與 `/functional-decomposition`，確認需求涉及的 **Objects**、**Relationships** 與 **CTAs** 是否已有預定義。

---

## Step 2. SDD: Spec Driven Development
**目標：針對單一 Domain 做技術與架構規格準備，確立開發序列。**

### 2.1 技術與架構選型
*   **技術棧**：確認是否使用現有 Composable、Store 或 API 規範。
*   **架構層次**：區分「純粹業務邏輯 (Pure Logic)」與「副作用環境 (Side Effect Layer)」。
    *   *提示：邏輯應優先寫在純函數中，副作用（如 API 調用、Cookie 讀寫）集中於 Composable 或 Service Layer。*

### 2.2 相依性任務設計 (Task Dependency)
*   **盤點關聯性**：找出潛在的相依 Task 或檔案關聯性（例如：後端 API 尚未完成前，前端的 Mock Layer 必須先建立）。
*   **開發順序確立**：
    *   **定位 Task**：預先分配一到兩次 Task 用於「定位與確立相依檔案」，避免開發中途發生阻塞。
    *   **優先級**：優先處理核心算法/純函數 (Low-level tools)，再處理整合層 (High-level components)。

---

## Step 3. TDD: Test Driven Development
**目標：以測試驅動開發，確保功能符合驗收標準。**

### 3.1 測試分層策略
*   **Unit Test (單元測試)**：
    *   **對象**：針對每一個單一功能、純函數進行驗收。
    *   **標準**：驗證輸入與輸出的一致性，確保 Core Logic 被 100% 覆蓋。
*   **E2E Test (端到端測試)**：
    *   **對象**：驗收整合後的多步驟功能流。
    *   **決策**：**請詢問開發人員** 是否在此階段同步進行，或是在 Feature 完成後的整合期進行。

---

## Step 4. 確立 Phase
**目標：最後確認並同步開發進度。**

*   **Task 同步**：再次確認 Step 2 中劃分的 Task 是否能反映目前的開發進度。
*   **Phase 切分**：根據 Task 的相依性，將開發計畫切分為明確的 Phase（如 Phase 1: Core Logic, Phase 2: UI Integration）。

---

## Step 5. Verification（驗證階段）
**目標：確保實作品質符合專案標準，此步驟為強制執行。**

### 5.1 Code Review
*   **執行 `code-review` skill**：進行架構與品質審查。
*   **審查範圍**：函數式編程原則、解耦架構、命名規範。

### 5.2 Test Execution
*   **執行 `gen-test-case` workflow**：生成測試案例並執行。
*   **驗收標準**：Core Logic 覆蓋率 100%，E2E 測試視情況決定。

### 5.3 Progress Update
*   **更新 `doc/progress/prd-progress.md`**：標註完成項目。
*   **計算進度**：重新計算 Feature/Phase/Total 進度百分比。

---

## 執行指南 (Checklist for Agent)

1.  **不跳步**：即使是微小需求，也必須快速掃過 Step 1-2，確保不破壞既有架構。
2.  **優先定位**：在開始寫 Code 前，確保已執行過「相依性定位 Task」。
3.  **對齊規範**：
    *   參考 `/01-functional-programming` 進行邏輯實作。
    *   參考 `/code-review-checklist` 進行自我審查。
4.  **動態詢問**：在 Step 1 & Step 3.2 遇到不確定性時，主動尋求開發人員指導。
5.  **強制驗證**：**任何 Task 完成後，必須執行 Step 5 (Verification)**，不可跳過。
6.  **進度同步**：每次 Verification 通過後，更新 `prd-progress.md`。

