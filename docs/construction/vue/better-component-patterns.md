這是一份基於影片內容整理的 Vue 組件開發指南，協助您判斷何時使用這些模式以及需要注意的限制：

### 1. Data Store Pattern (數據存儲模式)
這是一種使用 Composable 建立全域單例 (Singleton) 的輕量級狀態管理方式。

*   **適用場景**：
    *   解決 **Prop Drilling**（屬性層層傳遞）和 **Event Frothing**（事件層層冒泡）。
    *   解決 **Cousin Components** 問題（非父子關係的組件需要共享狀態）。
    *   需要簡單的跨組件通訊，不想引入 Pinia 的複雜度時。
*   **注意限制**：
    *   **無 SSR 安全性**：不具備伺服器端渲染的安全處理能力。
    *   **無 DevTools 整合**：無法像 Pinia 那樣在瀏覽器工具中追蹤狀態變化。
    *   如果需求變複雜或需要上述功能，請直接使用 Pinia,。

### 2. Hidden Components Pattern (隱藏組件模式)
將大組件拆分為獨立的小組件，通常是基於功能互斥的邏輯。

*   **適用場景**：
    *   組件內有明顯區隔的功能子集 (Distinct subsets of functionality)。
    *   透過 **Hardcoded Props** (寫死的屬性) 來控制顯示不同分支時（例如 `<MyComp graph />` vs `<MyComp table />`）。
*   **注意限制**：
    *   **動態 Props 效益低**：如果該屬性需要在執行時動態切換 (Dynamic props)，拆分後反而會製造出一個多餘的 Wrapper，這時可能不需要拆分。

### 3. Preserve Object Pattern (保留物件模式)
直接傳遞整個物件給子組件，而非解構為個別屬性。

*   **適用場景**：
    *   傳遞如 User, Product 等結構化資料給子組件時。
*   **優點**：
    *   **未來擴充性**：新增資料欄位時不需重構 Props 定義。
    *   **TypeScript 支援**：能更好利用型別推斷，減少重複定義型別的工作。
*   **注意限制**：
    *   **檢查內聚性**：如果多個子組件都只取用物件的一小部分，這可能是一個訊號，代表這些子組件應該合併，或是資料結構本身隱藏了另一個獨立的 Type,。

### 4. Refactoring Control Structures (條件與列表優化)
針對 `v-if` 和 `v-for` 的重構模式。

*   **Extract Conditional Pattern (提取條件)**：
    *   **適用**：遇到 `v-if` 分支時。
    *   **建議**：將每個分支提取為獨立組件。這讓代碼「自我文檔化 (Self-documenting)」，不用閱讀複雜模板就能從組件名稱知道它在做什麼（如 `ArticleCollapsed` vs `ArticleExpanded`）,。
*   **List Component Pattern (列表組件)**：
    *   **適用**：`v-for` 迴圈邏輯干擾閱讀時。
    *   **建議**：建立專屬的 List 組件（如 `ArticleList`），將迴圈語法隱藏起來，父層只需傳入陣列。

### 5. Meta Pattern (反向操作原則)
沒有絕對的規則，Context (情境) 決定一切。

*   **指南**：所有的模式都是**雙向的**。如果你發現拆分後的兩個組件代碼有 90% 重複，或者變得難以維護，**合併 (Merge)** 回單一組件反而是正確的優化,。
