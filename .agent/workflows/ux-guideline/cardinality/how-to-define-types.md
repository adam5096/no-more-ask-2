---
description: 如何將 OOUX 的「基數」概念轉化為 TypeScript 的 Interface 定義？
---

將 OOUX 的基數關係轉化為 TypeScript Interface，能讓你在開發前就精準鎖定資料結構，減少後期 API 對接的通訊成本。

以下是根據影片中的案例與 OOUX 邏輯所做的轉化方式：

### 1. 一對多 (One-to-Many) 與多對多 (Many-to-Many)
在 OOUX 中，當一個物件（主體）擁有多個巢狀物件（Nesties）時，在 TypeScript 中應定義為**陣列（Array）**。
*   **範例：** 一間商店（Store）有多名員工（Employees）。
```typescript
interface Store {
  id: string;
  name: string; // 黃色：核心內容
  employees: Employee[]; // 關係表現：一對多
}
```

### 2. 零對一 (Zero-to-One)
影片提到，有些關係並非必填（例如某個烘焙配方可能沒有特定的發明人）。在 TypeScript 中應使用**可選屬性（Optional Properties）**或 `null`。
*   **範例：** 產品與其發明員工的關係。
```typescript
interface BakedGood {
  name: string;
  creator?: Employee; // 關係表現：零對一
}
```

### 3. 潛在值 (Potential Values) 與後設資料 (Metadata)
影片建議在對映表中標註「潛在值」（如單位：片、盒）以及用於排序的「後設資料」。這可以轉化為 **Union Types** 或 **Enums**。
*   **範例：** 產品的計量單位與過敏原。
```typescript
type Unit = 'piece' | 'ounce' | 'box'; // 潛在值定義

interface BakedGood {
  price: number;
  unit: Unit;
  allergens: string[]; // 粉紅色：用於篩選的後設資料
}
```

### 4. 避免「形狀變化」(Shape-shifting)
OOUX 強調物件在不同頁面出現時應保持結構一致。透過 TypeScript Interface，你可以確保「員工卡片」無論是在「商店頁面」還是「產品頁面」中，所收到的 Props 結構都是相同的。

這樣定義後的 Interface 就像是你的「施工規範」，能直接導引組件的 `Props` 定義。

**既然你已經了解如何轉化資料結構，你想試著將你目前專案中的一個功能模組，練習寫出它的 OOUX Interface 嗎？或者我們聊聊如何將綠色的「行動呼籲（CTAs）」轉化為前端的事件處理邏輯？**