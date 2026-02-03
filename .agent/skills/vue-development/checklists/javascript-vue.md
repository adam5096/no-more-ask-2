# JavaScript/Vue 檢查清單

版本：v1.0
建立日期：2025
目的：提供 JavaScript/Vue 層面的任務前檢查項目

---

## 概述

本文檔提供 JavaScript/Vue 層面的檢查項目，涵蓋狀態管理、衍生狀態、監聽與副作用、資料獲取、效能考量、程式碼組織等核心決策點。

**相關文檔**：
- [主索引檔案](./index.md)
- [狀態管理決策框架](../../../.cursor/rules/vue-feature-workflow/vue3-state-management.mdc)
- [Computed vs Watcher 指南](../../../.cursor/rules/vue-feature-workflow/vue3-computed-vs-watcher.mdc)
- [副作用處理策略](../../functional-programming/references/04-side-effect-strategies.md)
- [副作用實務處理](../../functional-programming/references/05-side-effect-practices.md)
- [資料獲取策略](../../../workflows/construction/data-fetching/useFetch.md)
- [組織 Composition API 程式碼](../references/composition-api/code-organization.md)

---

## 1. 狀態管理決策

- [ ] **需要 tracking state 嗎？**
  - 如果不需要狀態，直接使用靜態內容或 props
  - 如果需要狀態，繼續以下檢查

- [ ] **需要幾個 state？**（列出清單）
  - 列出所有需要的狀態變數
  - 評估是否可以合併或簡化

- [ ] **每個 state 的範圍是？**
  - [ ] **Local State（單一組件）**：使用 `ref()` 或 `reactive()`
  - [ ] **Component-Tree（父子組件）**：使用 Props/Emits 或 Provide/Inject
  - [ ] **Cross-Module（跨路由/模組）**：使用 Pinia Store

- [ ] **state 發生更新的事件點？**（列出所有更新時機）
  - 用戶互動（點擊、輸入等）
  - API 回應
  - 路由變化
  - 其他組件事件

- [ ] **是否需要跨路由持久化？**
  - 如果需要，使用 Pinia Store
  - 如果不需要，優先使用 Local State 或 Component-Tree

**參考文檔**：[狀態管理決策框架](../../../.cursor/rules/vue-feature-workflow/vue3-state-management.mdc)

---

## 2. 衍生狀態決策

- [ ] **有哪些資料可以從現有 state 計算得出？**
  - 列出所有可以計算的衍生資料
  - 評估計算成本

- [ ] **這些衍生資料適合用 computed 嗎？**
  - [ ] **是純計算（無副作用）？**
  - [ ] **需要返回值？**
  - [ ] **計算成本可接受？**

- [ ] **computed 適用場景與限制**
  - ✅ 適合：純計算、資料過濾排序、格式化顯示、條件性狀態判斷
  - ❌ 不適合：需要非同步操作、有副作用、計算量極大且頻繁變動

**參考文檔**：[Computed vs Watcher 指南](../../../.cursor/rules/vue-feature-workflow/vue3-computed-vs-watcher.mdc)

---

## 3. 監聽與副作用決策

- [ ] **是否需要監聽 state 變化？**
  - 如果不需要，跳過此部分

- [ ] **監聽的目的是？**
  - [ ] **執行外部影響操作**（API、DOM、localStorage）
  - [ ] **同步狀態**
  - [ ] **其他**

- [ ] **watch 適用場景與限制**
  - ✅ 適合：執行外部影響操作、操作 DOM、本地儲存同步、路由導航、計時器與動畫
  - ❌ 不適合：純計算任務（應使用 computed）

- [ ] **是否有副作用需要處理？**
  - 識別所有副作用（API 呼叫、DOM 操作、localStorage、console.log 等）
  - 選擇適當的副作用處理策略

**參考文檔**：
- [Computed vs Watcher 指南](../../../.cursor/rules/vue-feature-workflow/vue3-computed-vs-watcher.mdc)
- [副作用處理策略](../../functional-programming/references/04-side-effect-strategies.md)
- [副作用實務處理](../../functional-programming/references/05-side-effect-practices.md)

---

## 4. 資料獲取決策

- [ ] **是否需要從 API 獲取資料？**
  - 如果不需要，跳過此部分

- [ ] **是否需要 SSR？**
  - 如果需要 SSR，使用 `useFetch` 或 `useAsyncData`
  - 如果不需要 SSR，可以使用 `$fetch`

- [ ] **使用哪種資料獲取方式？**
  - [ ] **useFetch**：頁面初始化資料、依賴響應式參數的請求、簡單的 API 呼叫
  - [ ] **useAsyncData**：複雜邏輯、並行請求、第三方 SDK、需要完全控制快取 Key
  - [ ] **$fetch**：事件觸發的操作（POST/PUT/DELETE）、不需要 SSR 的請求

**參考文檔**：[資料獲取策略](../../../workflows/construction/data-fetching/useFetch.md)

---

## 5. 效能考量

- [ ] **computed 計算成本是否過高？**
  - 如果計算成本高，考慮使用 `computed` 的 `cache` 選項或優化計算邏輯

- [ ] **watch 是否需要 deep / immediate？**
  - `deep: true`：監聽物件內部變化（注意效能影響）
  - `immediate: true`：立即執行一次（初始化時）

- [ ] **是否需要防抖/節流？**
  - 如果 watch 觸發頻繁，考慮使用防抖或節流

- [ ] **是否有不必要的響應式追蹤？**
  - 避免在 computed 或 watch 中追蹤不需要的依賴

---

## 6. 程式碼組織

- [ ] **邏輯是否按功能分組（而非按類型）？**
  - ✅ 正確：將相關的 `ref`、`computed`、`function`、`watch` 放在一起
  - ❌ 錯誤：所有 refs 放一起、所有 computed 放一起

- [ ] **是否需要提取為 Composable？**
  - 判斷標準：是否使用了其他 Composables、生命週期鉤子、管理有狀態的邏輯

- [ ] **Composable 是否只在當前組件使用（Inline）？**
  - 如果只在當前組件使用，使用 Inline Composable（寫在組件檔案底部）
  - 如果需要在多個組件使用，提取為獨立檔案

**參考文檔**：[組織 Composition API 程式碼](../references/composition-api/code-organization.md)

---

**文檔版本**：v1.0  
**最後更新**：2025  
**維護者**：待指定

