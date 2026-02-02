---
description: Implementation Plan 的建立、實施、收尾與接續的完整生命週期（含 HITL 檢查點）
---

# Implementation Lifecycle Workflow

本 Workflow 定義 Implementation Plan 從建立到收尾的完整生命週期，並整合 HITL (Human in the Loop) 檢查點，確保 AI 與人類的有效協作。

---

## 前置條件

執行此 Workflow 前，必須確保：
1. 已讀取 `doc/progress/prd-progress.md` 確認當前進度
2. 已確認目標 Feature 的 Task 清單

---

## Step 1. 建立 Plan (Planning)

**目標**：根據 `development-workflow.md` 設計 Implementation Plan

### 1.1 讀取進度
- 解析 `prd-progress.md` 的 YAML Frontmatter 獲取 `current_phase` 與 `total_progress`
- 識別下一個未完成的 Feature/Task

### 1.2 設計 Plan
- 依循 `development-workflow.md` 的 DDD → SDD → TDD 流程
- 明確標註本次 Plan 的權重貢獻

### 1.3 🔴 HITL: 審核修正
```
觸發條件：Plan 設計完成後
AI 行為：使用 notify_user 通知開發人員審核
等待：BlockedOnUser: true
通知內容：「請審核 Implementation Plan，確認後回覆 'proceed'」
```

---

## Step 2. 執行 Plan (Execution)

**目標**：依 Plan 逐項執行 Task

### 2.1 執行 Task
- 按順序執行每個 Task
- 每完成一項更新 `prd-progress.md`

### 2.2 🔴 HITL: 決策導向
```
觸發條件：遇到多個可行方案時
AI 行為：使用 notify_user 列出選項
等待：BlockedOnUser: true
通知內容：「有 N 個方案可選：[A] [B] [C]，請指示」
```

### 2.3 🔴 HITL: 除錯反饋
```
觸發條件：執行出錯時
AI 行為：使用 notify_user 附上錯誤訊息
等待：BlockedOnUser: true
通知內容：「遇到錯誤：[error message]，請指示下一步」
```

### 2.4 自動繼續條件
- 非 HITL 觸發情況：自動繼續下一項 Task
- 可設定 `ShouldAutoProceed: true` 當 AI 對結果高度自信

---

## Step 2.5. 單元測試 (Unit Testing)

**目標**：為符合條件的純函數撰寫單元測試

### 2.5.1 識別測試目標

根據以下指標判斷是否需要單元測試：

| 指標 | 權重 | 說明 |
|------|------|------|
| 純函數 | ⭐⭐⭐ | 無副作用，輸入確定輸出 |
| 邊界條件多 | ⭐⭐⭐ | 如時間格式、數值範圍、空值處理 |
| 被多處複用 | ⭐⭐ | 位於 `utils/`、`lib/` 的共用函數 |
| 複雜邏輯分支 | ⭐⭐ | if/else、switch 超過 3 個分支 |

**觸發條件**：符合 2 項以上指標 → 必須撰寫單元測試

### 2.5.2 測試範圍

| 類型 | 必要性 | 說明 |
|------|--------|------|
| `utils/` 純函數 | ✅ 必要 | 直接測試 |
| Composable 純邏輯 | ⚠️ 視情況 | 提取內部純函數再測試 |
| UI Components | ❌ 跳過 | 由 E2E 覆蓋 |
| API Routes | ⚠️ 視情況 | 整合測試優先 |

### 2.5.3 執行測試

```bash
pnpm test        # 執行單元測試
pnpm test:cov    # 含覆蓋率報告
```

### 2.5.4 🟡 HITL: 測試失敗
```
觸發條件：測試執行失敗
AI 行為：分析失敗原因，修復代碼或測試
等待：依情況，簡單錯誤可自動修復
```

## Step 3. 收尾驗證 (Verification)

**目標**：確保實作品質符合標準

### 3.1 執行驗證
- 使用 `code-review` skill 進行架構與品質審查
- 使用 `gen-test-case` workflow 生成並執行測試

### 3.2 🔴 HITL: 審核修正
```
觸發條件：驗證完成後
AI 行為：使用 notify_user 通知開發人員審核結果
等待：BlockedOnUser: true
通知內容：「Code Review 與 Test 已完成，請審核結果」
```

### 3.3 更新進度
- 審核通過後，更新 `prd-progress.md` 對應 Task 為 Done
- 重新計算 Feature/Phase/Total 進度百分比

### 3.4 更新分析統計 (Usage Analytics)
- 根據本次開發中使用的 Skill 與 Workflow，使用 `usage-analytics` skill 更新 `doc/analytics/usage-stats.md`
- 記錄對工具的優化建議或棄用評估

---

## Step 4. 接續下一個 Plan (Continuation)

**目標**：無縫接續下一個開發任務

### 4.1 識別下一個 Task
- 讀取 `prd-progress.md` 的下一個未完成項目
- 評估 Task 優先級與相依性

### 4.2 🔴 HITL: 決策導向
```
觸發條件：選擇下一個 Task 時
AI 行為：使用 notify_user 建議下一個 Task
等待：依 ShouldAutoProceed 判斷
通知內容：「建議下一個 Task 為 [X]，確認？」
```

### 4.3 回到 Step 1
- 開發人員確認後，回到 Step 1 建立新的 Plan

---

## HITL 觸發總覽

| 場景 | 觸發時機 | 嚴重程度 | AutoProceed |
|------|----------|----------|-------------|
| 審核修正 | Plan/Verify 完成 | 高 | 否 |
| 決策導向 | 多選項 | 中 | 否 |
| 除錯反饋 | 執行出錯 | 高 | 否 |
| 測試失敗 | 單元測試紅燈 | 中 | 可依錯誤複雜度 |
| 接續確認 | 選擇下一個 Task | 低 | 可依信心程度 |

---

## 與 development-workflow.md 的關係

```
development-workflow.md          implementation-lifecycle.md
┌─────────────────────┐          ┌─────────────────────┐
│ Step 1: DDD         │ ──────►  │ Step 1: Plan        │
│ Step 2: SDD         │          │   (DDD + SDD + TDD) │
│ Step 3: TDD         │          │                     │
│ Step 4: Phase       │ ──────►  │ Step 2: Execute     │
│                     │          │ Step 2.5: Unit Test │
│ Step 5: Verification│ ──────►  │ Step 3: Verify      │
└─────────────────────┘          │ Step 4: Continue    │
                                 └─────────────────────┘
```

---

**文檔版本**：v1.0  
**維護者**：AI + Developer  
