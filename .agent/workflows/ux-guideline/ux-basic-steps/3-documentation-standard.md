---
description: 定義設計師與開發者之間的「共通語言」紀錄格式
---

### 1. 人類友善：物件矩陣 (Object Matrix)

推薦使用 **Notion Database** 或 **Google Sheets**。橫向列出物件，縱向定義其 R, C, A。這比畫圖更容易修改與收斂。

### 2. 開發友善：JSON Schema

為了對接 Vue 3 與 C#，推薦將定稿的物件圖紀錄為 `.json`：

```json
{
  "object": "Experience",
  "meta": { "description": "職業體驗案" },
  "relationships": { "hasOne": ["Mentor"], "hasMany": ["Applicants"] },
  "ctas": ["publish", "apply", "cancel"],
  "attributes": { "title": "string", "price": "number" }
}

```

* **前端用途：** 直接作為 `mockData` 結構或 TypeScript 的 `interface` 定義。
* **後端用途：** 作為 C# `Entity` 與 `DTO` 的設計藍本。

---

## 導航 (Navigation)

*   **👆 上一步**: [2-orca-object-modeling.md](./2-orca-object-modeling.md)

## 相關技能 (Related Skills)

*   **`orca-modeling`**: 此技能可以直接產出本文件定義的標準 JSON 格式模型。