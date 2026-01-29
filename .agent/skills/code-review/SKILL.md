---
name: code-review
description: 根據專案編程範式與設計原則進行 Code Review
---

# Code Review Skill

根據 `.agent/workflows/construction/` 中的編程範式與設計原則，以及特定架構位置的規範，對程式碼進行審查。

## 使用方式

在對話中輸入：
```
請使用 code-review skill 審查 [檔案路徑或程式碼]
```

## 審查邏輯 (Path-Aware)

當執行審查時，請優先根據**檔案所在路徑**載入對應的細節規範：

1.  **Middleware 層 (`middleware/`)**:
    載入 [middleware-review.md](./instructions/middleware-review.md)
    *   重點：Auth Guard, Side-effect Isolation, Session Restoration.

2.  **Server/API 層 (`server/`)**:
    載入 [server-review.md](./instructions/server-review.md)
    *   重點：BFF Paths, HATEOAS (`_links`), Payload Optimization.

3.  **UI/Vue 層 (`components/`, `pages/`, `layouts/`)**:
    載入 [vue-review.md](./instructions/vue-review.md)
    *   重點：Atomic UI, Component Structure, Single Responsibility.

## 核心審查維度

### 1. 函數式編程原則
詳見 [fp-review.md](./instructions/fp-review.md)
- 純函數檢查與不可變性。

### 2. 分層架構與解耦
詳見 [architecture-review.md](./instructions/architecture-review.md)
- 依賴注入、UI/邏輯分離。

### 3. 組件與邏輯收斂
詳見 [unification-review.md](./instructions/unification-review.md)
- UI 原子化、SSOT 原則。

### 4. ESLint 指引
詳見 [eslint-review.md](./instructions/eslint-review.md)
- 型別安全、錯誤處理規範。

## 審查輸出格式

```
## Code Review 結果

### 🎯 審查領域：[例如：Middleware / Server / UI]

### ✅ 通過
- [項目說明]

### ⚠️ 建議改進
- [項目說明]
- **建議**：[改進方式]

### ❌ 需要修改
- [項目說明]
- **原因**：[違反規範]
- **修改建議**：[具體程式碼]
```

## 參考文檔

- [checklist-summary.md](./references/checklist-summary.md)
- `.agent/workflows/construction/nitro/bff-paths.md`
- `.agent/workflows/construction/nitro/hateoas.md`
- `.agent/workflows/session-management.md`
