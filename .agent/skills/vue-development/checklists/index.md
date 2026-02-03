# 任務前檢查清單

版本：v1.0
建立日期：2025
目的：提供任務前檢查清單，確保架構決策正確，涵蓋 JavaScript/Vue、HTML、CSS 三個層面

---

## 文檔概述

本文檔提供任務前檢查清單，幫助開發者在實作任何 Vue 功能前進行架構決策檢查。這些檢查項目旨在：

- 避免常見的架構錯誤
- 確保程式碼符合專案規範
- 提升程式碼品質與可維護性
- 減少後續重構成本

### 目標讀者

- 前端工程師：實作 Vue 3 / Nuxt 3 組件與 Composables
- 技術負責人：進行 Code Review 與架構決策

### 技術棧背景

本專案使用以下技術棧：
- 前端框架：Nuxt 3 + Vue 3
- 程式語言：TypeScript
- 樣式系統：Tailwind CSS + Design Tokens
- 開發範式：函數式編程優先

---

## 使用方式

在實作任何 Vue 功能前，請先回答以下檢查清單中的問題，確保架構決策正確。

### 檢查流程

1. **閱讀概述**：了解檢查清單的目的與結構
2. **依序檢查**：按照 JavaScript/Vue → HTML → CSS 的順序進行檢查
3. **參考文檔**：遇到不確定的問題時，參考相關知識庫文檔
4. **記錄決策**：對於重要的架構決策，建議記錄決策原因

---

## 文檔結構

本文檔採用「摘要+引用」風格，主文件提供概述與導航，詳細檢查項目請參考各子文件。

### JavaScript/Vue 檢查

**檔案**：[javascript-vue.md](./javascript-vue.md)

**包含內容**：
- 狀態管理決策（Local/Component-Tree/Cross-Module）
- 衍生狀態決策（computed 適用場景與限制）
- 監聽與副作用決策（watch 適用場景與限制）
- 資料獲取決策（useFetch vs useAsyncData vs $fetch）
- 效能考量（計算成本、watch 選項）
- 程式碼組織（邏輯分組、Composable 提取）

**快速摘要**：
JavaScript/Vue 檢查涵蓋狀態管理、衍生狀態、監聽與副作用、資料獲取等核心決策點。重點在於選擇適當的狀態管理範圍、正確使用 computed 和 watch、選擇合適的資料獲取方式。

詳細內容請參考：[javascript-vue.md](./javascript-vue.md)

### HTML 結構檢查

**檔案**：[html.md](./html.md)

**包含內容**：
- 語義化 HTML 決策（標籤選擇、ARIA 標籤、無障礙功能）
- HTML 結構層級（層級深度、組件提取）
- 內容組織（邏輯區塊、條件渲染、列表渲染）

**快速摘要**：
HTML 結構檢查確保使用語義化標籤、合理的結構層級、正確的內容組織。重點在於提升可讀性、可維護性和無障礙性。

詳細內容請參考：[html.md](./html.md)

### CSS 樣式檢查

**檔案**：[css.md](./css.md)

**包含內容**：
- Design Token 使用（CSS 變數、新增 Token）
- Tailwind CSS 使用策略（Utility Classes、響應式斷點）
- 樣式組織與重用（scoped vs 全域、重複樣式提取）
- 響應式設計（斷點策略、顯示/隱藏邏輯）
- 效能考量（未使用 CSS、內聯樣式）
- 視覺層級與一致性（設計規範遵循、語義化顏色系統）
- 互動與動畫（過渡動畫、hover/focus 狀態、loading 狀態）

**快速摘要**：
CSS 樣式檢查確保使用 Design Token、正確使用 Tailwind CSS、遵循響應式設計規範。重點在於保持樣式一致性、提升效能、符合設計規範。

詳細內容請參考：[css.md](./css.md)

---

## 相關文檔

### JavaScript/Vue 相關

- [狀態管理決策框架](../../../.cursor/rules/vue-feature-workflow/vue3-state-management.mdc)
- [Computed vs Watcher 指南](../../../.cursor/rules/vue-feature-workflow/vue3-computed-vs-watcher.mdc)
- [副作用處理策略](../../functional-programming/references/04-side-effect-strategies.md)
- [副作用實務處理](../../functional-programming/references/05-side-effect-practices.md)
- [資料獲取策略](../../../workflows/construction/data-fetching/useFetch.md)
- [組織 Composition API 程式碼](../references/composition-api/code-organization.md)
- [組件模式指南](../references/component-patterns/component-patterns.md)

### HTML/CSS 相關

- [設計規範](../../../prd/wireframes-v2.md)
- [組件庫規劃](../../component-library.md)
- [Tailwind Config](../../../tailwind.config.js)
- [Design Tokens](../../../tokens/)

### 編程範式與設計原則

- [編程範式與設計原則](../../functional-programming/references/index.md)
- [函數式編程](../../functional-programming/references/01-functional-programming.md)
- [設計原則](../../functional-programming/references/02-design-principles.md)

---

**文檔版本**：v1.0  
**最後更新**：2025  
**維護者**：待指定

