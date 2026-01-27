# Code Review 檢查清單摘要

完整版本請參考：`.agent/workflows/construction/code-review-checklist.md`

---

## 必檢項目（必須通過）

- [ ] 核心業務邏輯為純函數
- [ ] 函數符合單一職責原則
- [ ] 依賴透過參數注入
- [ ] 包含對應的測試
- [ ] 類型定義完整
- [ ] 組件結構符合規範
- [ ] UI 層不直接呼叫 `$fetch`

---

## 建議改進項目

- [ ] 函數長度超過 50 行
- [ ] 使用 `any` 類型
- [ ] 測試覆蓋率不足
- [ ] BFF 路徑命名不符規範

---

## 相關文檔索引

| 主題 | 路徑 |
|------|------|
| 編程範式總覽 | `construction/programming-paradigms/index.md` |
| 函數式編程 | `construction/programming-paradigms/01-functional-programming.md` |
| 設計原則 | `construction/programming-paradigms/02-design-principles.md` |
| 副作用處理 | `construction/programming-paradigms/04-side-effect-strategies.md` |
| 解耦架構 | `construction/decoupling-architecture.md` |
| BFF 路徑 | `construction/nitro/bff-paths.md` |
| Vue 組件 | `construction/vue/organize-composition-api-code.md` |
