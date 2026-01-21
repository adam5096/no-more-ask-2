這份指南是根據 Alexander Lichter 的 Nuxt 效能深度剖析影片整理而成，旨在協助開發者正確使用 `transform` 函數來優化 `__NUXT__` Payload 大小。

---

# Nuxt `transform` 函數使用指南：Payload 優化策略

## 1. 核心概念
在 Nuxt 應用（特別是 Nuxt 3）中，`useFetch` 或 `useAsyncData` 獲取的資料會被儲存在 `window.__NUXT__` 物件中（即 Payload），用於前端 Hydration（注水）。若 API 回傳過多不必要的欄位（Over-fetching），會導致 HTML 文件體積暴增，影響效能,。

`transform` 是一個配置選項，允許你在資料寫入 Payload 之前，對其進行篩選或轉換，僅保留前端渲染所需的資料。

---

## 2. 適用場景 (Use Cases)

建議在以下情境優先使用 `transform` 函數：

### A. 靜態網站生成 (SSG) 的首選方案
當你的專案採用 `nuxt generate` (Static Site Generation) 時，`transform` 是最簡單且高效的優化方式。
*   **原因**：在 SSG 建置過程中，`useFetch` 的呼叫結果會被寫入靜態 Payload 檔案。透過 `transform` 去除雜訊資料，可以顯著減少最終生成的靜態檔案大小，而無需額外建立伺服器端 API 端點,。

### B. 使用不可控的外部 API
當你必須呼叫第三方的 API，且該 API 回傳大量你不需要的巢狀數據（例如影片中的 Destiny 2 API 案例），而你又無法修改該 API 的回傳結構時。

### C. 快速修正 Over-fetching
當你需要快速減少 Payload 大小，且不想花時間建立「後端服務前端」(BFF, Backend for Frontend) 的中介層時，`transform` 提供了一個輕量級的轉換層。

---

## 3. 實作範例

以下示範如何將一個龐大的 API 回傳物件，轉換為僅包含所需欄位的精簡物件：

```typescript
// 原始 API 可能回傳數百個欄位，導致 Payload 巨大
const { data } = await useFetch('/api/destiny-item', {
  // 使用 transform 函數接收原始 input
  transform: (input) => {
    // 僅回傳頁面渲染真正需要的欄位
    return {
      name: input.item.name,
      flavorText: input.item.flavorText,
      icon: input.item.icon
    }
  }
})
```

**優化效益：** 在影片的案例中，使用此方法將 HTML 文件大小從 **76 KB** 減少至 **2.2 KB**，移除了大量無用的資料雜訊。

---

## 4. 使用限制與最佳實踐 (Limitations & Best Practices)

雖然 `transform` 很方便，但它並非所有效能問題的萬靈丹。請根據你的架構選擇最合適的策略：

### 限制 1：並未減少伺服器端的頻寬消耗
`transform` 是在 Nuxt 獲取資料**後**、傳送給客戶端**前**運作的。這意味著如果你的 Nuxt 伺服器（Nitro）去呼叫外部 API，Nitro 仍然會下載完整的 76KB 資料，只是它過濾後只傳給瀏覽器 2.2KB。

### 限制 2：與其他架構的比較
影片中提出了三種層級的解決方案，請依照控制權限選擇：

| 優先級 | 方案 | 適用情境 | 說明 |
| :--- | :--- | :--- | :--- |
| **最高** | **修改 API 端** | 你擁有 API 控制權 | 直接修改後端程式碼或使用 GraphQL，從源頭解決 Over-fetching，這是最理想的狀況,。 |
| **次高** | **Nitro Proxy (BFF)** | SSR + 外部 API | 如果是伺服器端渲染 (SSR)，建議在 Nuxt Server (Nitro) 建立一個 API 端點作為代理。由這個端點去呼叫外部 API 並清洗資料，再傳給前端。這樣結構更清晰，適合複雜邏輯,。 |
| **特定** | **transform 函數** | SSG 或 輕量級需求 | **本指南重點**。特別適合靜態生成，或者不想額外寫一支 API 的情境。它能確保 `window.__NUXT__` 保持乾淨。 |

### 注意事項
*   **型別推斷 (TypeScript)**：使用 `transform` 後，Nuxt 會自動更新 `data` 的型別定義。原本 `data.value.item` 存在的屬性，如果被過濾掉，TypeScript 會正確報錯，這有助於開發者維護程式碼。
*   **Nuxt Content 整合**：如果你使用 Nuxt Content，也可以利用類似的 `queryContent().only(['title', 'slug'])` 概念來達到減少 Payload 的效果。

---

## 5. 總結
`transform` 是 Nuxt 提供的一個強大工具，用於解決 **Payload 膨脹** 問題。雖然在 SSR 模式下建立專屬的 Nitro Endpoint 可能是更標準的 BFF 模式，但在 **SSG (靜態生成)** 場景下，`transform` 提供了無可比擬的便利性與減量效果。