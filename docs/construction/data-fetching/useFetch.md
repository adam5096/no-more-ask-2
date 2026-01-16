在這三份關於 Nuxt 3 資料獲取（Data Fetching）的文件中，我為您整理了關鍵發現，並根據這些內容建立了 `useFetch` 與 `useAsyncData` 的使用指南。

### 第一部分：我發現了什麼？ (Findings)

透過整合官方文件與 Alexander Lichter 的技術解析，核心發現如下：

1.  **Nuxt 的資料獲取機制是為了「解決水合（Hydration）問題」**：
    Nuxt 是一個通用（Universal/Isomorphic）框架。如果只用原生的 `fetch` 或 `$fetch` 在組件 setup 階段獲取資料，會導致伺服器端渲染（SSR）和客戶端水合時重複發送請求。`useFetch` 和 `useAsyncData` 的核心作用是將伺服器端獲取的資料透過 `payload` 傳遞給客戶端，避免重複請求。

2.  **三者的階層關係明確**：
    *   **`$fetch`**：最底層的 fetch 函式（基於 ofetch），適合單純的網路請求，不具備狀態管理功能。
    *   **`useAsyncData`**：中間層的 Composable，負責處理非同步邏輯的狀態（data, pending, error）與快取，但不限定於網路請求，可用於任何 Promise。
    *   **`useFetch`**：最高層的語法糖（Sugar），本質是 `useAsyncData` 包裹了 `$fetch`。它自動處理了 Key 的生成和響應式參數的監聽。

3.  **常見的致命錯誤：在事件處理器中使用 `useFetch`**：
    Alexander Lichter 特別強調，**絕不應該**在 `onSubmit` 或 `onClick` 等事件函式內部呼叫 `useFetch`。因為 `useFetch` 是一個 Composable，設計用於 `setup` 頂層。在事件中呼叫它會導致每次觸發都建立新的實例、無法被正確回收，甚至造成無限迴圈或大量重複請求。

---

### 第二部分：useFetch 與 useAsyncData 使用指南

基於文件內容，以下是這兩支 API 的適用範圍、限制與最佳實踐。

#### 1. useFetch
這是最常用的資料獲取方式，專為開發體驗（DX）優化。

*   **適用範圍 (When to use)**：
    *   **頁面初始化資料**：在組件 setup 頂層獲取資料，用於頁面渲染（SSR 友善）。
    *   **依賴響應式參數的請求**：當 URL 或參數（query, body）依賴 Vue 的 `ref` 或 `computed` 時，`useFetch` 會自動監聽並重新獲取資料。
    *   **簡單的 API 呼叫**：不需要對請求邏輯做過多客製化時。

*   **使用方式範例**：
    ```typescript
    // 自動監聽 id 變化並重新 fetch
    const { data, status } = await useFetch(() => `/api/users/${id.value}`)
    ```

*   **重要限制與注意事項**：
    *   **禁止在函式內部使用**：不要在 `function handler() { ... }` 內部呼叫 `useFetch`。若需在點擊按鈕後觸發，應使用 `$fetch`。
    *   **參數自動解包**：傳遞 `ref` 給 `query` 或 `body` 時，`useFetch` 會自動解包（`.value`），不需手動處理。
    *   **Key 的自動生成**：預設使用 URL 作為快取 Key。如果多個組件呼叫相同 URL 但需要獨立狀態，需手動指定不同的 `key`。

#### 2. useAsyncData
這是更底層、控制權更高的 Composable，適用於複雜場景。

*   **適用範圍 (When to use)**：
    *   **非 `$fetch` 的非同步操作**：例如使用 CMS 的 SDK、GraphQL 客戶端，或自行封裝的 API 層。
    *   **並行請求 (Parallel Requests)**：使用 `Promise.all` 一次等待多個請求完成。
    *   **複雜的邏輯控制**：當你需要完全控制緩存 Key，或 `useFetch` 的自動監聽行為不符合需求時。

*   **使用方式範例**：
    ```typescript
    // 包裹多個請求或第三方 SDK
    const { data } = await useAsyncData('unique-key', async () => {
      const [res1, res2] = await Promise.all([
        $fetch('/api/one'),
        $fetch('/api/two')
      ])
      return { res1, res2 }
    })
    ```

*   **重要限制與注意事項**：
    *   **必須指定 Key (建議)**：雖然可以自動生成，但為了避免檔名/行號變動導致的快取問題，強烈建議手動提供第一個參數作為唯一 Key。
    *   **沒有自動響應式監聽**：與 `useFetch` 不同，`useAsyncData` 內部的 `$fetch` 不會自動監聽外部變數。若需在變數改變時重新請求，必須顯式使用 `watch` 選項。
    *   **手動解包 Ref**：在 Handler 內部使用變數時，必須使用 `.value`（例如 `page.value`），因為內部的函式只是一般的 JavaScript 函式。

#### 3. 補充：何時使用 $fetch？
雖然您主要詢問前兩者，但區分何時使用 `$fetch` 至關重要。

*   **適用範圍**：
    *   **客戶端互動 (Client-side interactions)**：表單提交 (POST)、刪除 (DELETE)、登入動作等。
    *   **不需要 SSR 的請求**：在事件處理器（Event Handler）中觸發的邏輯。

---

### 總結比較表

| 特性 | useFetch | useAsyncData | $fetch |
| :--- | :--- | :--- | :--- |
| **本質** | `useAsyncData` + `$fetch` 的語法糖 | 包裹任何非同步邏輯的 Composable | 底層網路請求函式 (基於 ofetch) |
| **主要用途** | 頁面載入時獲取資料 (GET) | 複雜邏輯、第三方 SDK、並行請求 | 事件觸發的操作 (POST/PUT/DELETE) |
| **SSR 支援** | ✅ 自動 (傳輸 Payload) | ✅ 自動 (傳輸 Payload) | ❌ 僅在伺服器執行或僅在客戶端執行 |
| **響應式 (Reactivity)** | ✅ 自動監聽 URL/參數變化 | ⚠️ 需手動設定 `watch` 選項 | ❌ 無響應式 |
| **使用位置** | **僅限** setup 頂層 | **僅限** setup 頂層 | 任何地方 (包含函式內) |

### 💡 譬喻幫助理解

您可以這樣想像：

*   **`$fetch` 就像是「點餐服務員」**：你叫他去廚房（伺服器）拿食物，他拿了就回來。如果你在頁面載入時只用他，伺服器渲染時叫了一次，瀏覽器顯示時你又叫了一次，你會拿到兩份一樣的餐點（重複請求）。
*   **`useAsyncData` 就像是「餐廳訂位系統」**：它確保了你們這桌（元件）的餐點狀態。如果伺服器已經幫你點好餐（SSR），它會把訂單資訊（Payload）傳給瀏覽器，瀏覽器看到訂單就不會再重新點餐。但他不管你吃什麼，你可以點義大利麵，也可以點外送（第三方 SDK）。
*   **`useFetch` 就像是「精選套餐」**：它內建了訂位系統（`useAsyncData`）和特定餐點（`$fetch`）。只要你坐下來（Component Setup），它就自動幫你上菜。如果你換了桌號（參數改變），它會自動幫你換菜。但你不能在吃到一半想加點飲料時（Event Handler）再重新叫一套「精選套餐」，那樣流程會大亂，這時候你應該直接找服務員（`$fetch`）。