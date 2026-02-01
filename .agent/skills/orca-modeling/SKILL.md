---
name: orca-modeling
description: 執行 ORCA 分析，協助使用者將模糊需求轉化為結構化的物件導向模型 (Objects, Relationships, CTAs, Attributes)。
---

# ORCA Modeling Skill

本技能專注於執行 ORCA (Object-Relationship-CTA-Attribute) 建模分析。它能協助你引導使用者進行訪談、過濾假物件、定義物件關係，並最終產出標準化的 JSON 模型。

## 核心能力

1.  **訪談引導 (Discovery)**：透過 Noun-Verb Foraging 找出潛在物件。
2.  **物件過濾 (Filtering)**：識別並剔除 UI 級假物件、元數據與純屬性。
3.  **關係定義 (Relationships)**：確立物件之間的 1:1, 1:N, N:N 關係。
4.  **棕地映射 (Brownfield Mapping)**：處理舊有資料庫與理想模型之間的映射。
5.  **格式產出 (Output)**：生成符合標準的 JSON Schema。

## 執行流程

### 步驟 1：探索與定義 (Discovery)

使用以下提問策略來挖掘「原始材料」：

*   **物件 (Objects)**：「在這個系統中，最重要的『名詞』是什麼？如果它消失了，業務會無法運作？」
*   **關係 (Relationships)**：「一個 [A] 可以擁有幾個 [B]？[B] 能否獨立於 [A] 存在？」
*   **行為 (CTAs)**：「使用者會對這個 [物件] 做什麼動作？(例如：申請、取消、審核)」
*   **屬性 (Attributes)**：「查看這個列表時，使用者最先關注的 3 個資訊是什麼？」

### 步驟 2：過濾與收斂 (Filtering)

在建立模型時，必須過濾掉以下「假物件」：

*   **❌ UI 容器**：Sidebar, Banner, Modal (脫離 UI 就不存在的東西)。
*   **❌ 純屬性**：Status, Type (依附於其他物件的描述)。
*   **❌ Metadata**：Pagination, Log (屬於系統層級而非業務層級)。

### 步驟 3：產出模型 (Output Specification)

最終產出必須符合以下 JSON 格式：

```json
{
  "object": "ObjectName",
  "meta": {
    "description": "物件的業務定義",
    "isBrownfield": false
  },
  "relationships": {
    "hasOne": ["ParentObj"],
    "hasMany": ["ChildObj"]
  },
  "ctas": ["action1", "action2"],
  "attributes": {
    "key1": "string | number | boolean",
    "key2": "Date"
  }
}
```

## 棕地專案特別指南 (Brownfield Context)

若使用者表明是「舊系統維護」(Brownfield)：

1.  **映射模式**：不只是創造新物件，需詢問「這對應到舊資料庫的哪個 Table？」。
2.  **缺口分析**：標註 **Missing** (舊庫沒有但新需求要) 與 **Broken** (舊庫結構不合理) 的屬性。
3.  **防腐層建議**：若舊結構極差，建議在 Output 中備註 `Adapter` 或 `Transformer` 的設計需求。

## 範例指令

*   「請幫我對『若比鄰 (Job Board)』系統進行 ORCA 建模。」
*   「我有一個舊的電商資料庫，請幫我重新整理出清潔的 User 與 Order 物件模型。」
