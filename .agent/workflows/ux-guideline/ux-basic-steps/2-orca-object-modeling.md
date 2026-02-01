---
description: 將訪談內容轉化為物件導向結構，並過濾「假物件」
---

### 1. ORCA 評估順序 (由內而外)

1. **Objects (核心)：** 確定最穩定的實體。
2. **Relationships (骨架)：** 定義 1:1, 1:N, N:N（對應 SQL 外鍵）。
3. **CTAs (行為)：** 定義使用者動作（對應 API Endpoints）。
4. **Attributes (血肉)：** 定義欄位規格（對應 Vue Props / DTO）。
5. **UI Components (外殼)：** 視覺呈現（最後考慮，隨時可換）。

### 2. 陷阱過濾：避開「假物件」

| 類別 | 特徵 | 應對方式 |
| --- | --- | --- |
| **UI 級假物件** | 隨載體改變 (如 Sidebar, Banner) | 詢問：脫離 Web 端它還存在嗎？若否，則非物件。 |
| **Attribute** | 描述性質，無獨立生命週期 | 將其收納進對應的 Object 中。 |
| **Metadata** | 關於資料的資料 (如 Pagination) | 在 C# 中用 Base Class 或 Middleware 處理，不列入業務物件。 |

### 3. 收斂與應對

* **出現多餘物件？** 進行「獨立性測試」。不能獨立存在的，合併或降級為屬性。
* **物件太過龐大？** 檢查「邊界」，依職責拆分（如將 Payment 從 Order 拆出）。

---

## 導航 (Navigation)

*   **👆 上一步**: [1-discovery-interview.md](./1-discovery-interview.md)
*   **👇 下一步**: [3-documentation-standard.md](./3-documentation-standard.md) (定義 JSON 格式)

## 特別場景 (Context)

*   若您正在處理舊系統 (Brownfield)，在建模前請務必先閱讀策略文件：[5-greenfield-vs-brownfield-strategy.md](./5-greenfield-vs-brownfield-strategy.md)。