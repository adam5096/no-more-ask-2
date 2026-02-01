---
description: [Strategy] 根據團隊人力配置，調整評估流程的執行重點
---

### 場景 A：一人全端 (Solo Dev)

* **重心：** 減少「上下文切換」的認知負擔。
* **策略：** 嚴格遵循「評估順序」。先固定 Object Map 再開寫 C#，最後才寫 Vue。
* **優勢：** 檔案 3 (JSON) 就是你的唯一真相來源 (SSOT)。

### 場景 B：前後端分工 (Team Dev)

* **重心：** 建立「契約 (Contract)」。
* **策略：** 1. 前後端共同確認 **Objects & CTAs**。
2. 後端根據 **Relationships** 開資料庫。
3. 前端根據 **Attributes** 定義 Vue Props。
* **優勢：** 透過 ORCA 產出的 JSON 規範，兩端可實現平行開發，互不等待。