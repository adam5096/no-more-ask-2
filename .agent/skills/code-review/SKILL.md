---
name: code-review
description: 根據專案編程範式與設計原則進行 Code Review
---

# Code Review Skill

根據 `.agent/workflows/construction/` 中的編程範式與設計原則，對程式碼進行審查。

## 使用方式

在對話中輸入：
```
請使用 code-review skill 審查 [檔案路徑或程式碼]
```

## 審查範圍

### 1. 函數式編程原則
詳見 [fp-review.md](./instructions/fp-review.md)
- 純函數檢查
- 不可變性
- 函數組合

### 2. Vue/Nuxt 規範
詳見 [vue-review.md](./instructions/vue-review.md)
- 組件結構順序
- Composable 設計
- 單一職責

### 3. 分層架構
詳見 [architecture-review.md](./instructions/architecture-review.md)
- UI/邏輯/BFF 解耦
- 依賴注入
- BFF 路徑命名

### 4. ESLint 規範
詳見 [eslint-review.md](./instructions/eslint-review.md)
- 禁用 any 類型
- 禁止未使用變數
- 統一錯誤處理

## 審查輸出格式

```
## Code Review 結果

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
- `.agent/workflows/construction/code-review-checklist.md`
- `.agent/workflows/construction/programming-paradigms/`
