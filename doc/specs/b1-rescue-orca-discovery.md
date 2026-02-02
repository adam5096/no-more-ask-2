# B1 救援功能 ORCA Discovery

**日期**: 2026-02-02  
**版本**: v1.0

---

## 使用場景

**核心場景**：亞洲過新年回老家
- 遇到長輩不禮貌/尷尬的關心問候
- 想租用「擋箭牌朋友」陪同回家，幫忙回答惱人問題
- 獲得喘息空間

**用戶需求**：
1. 找人幫忙接話/回答惱人問題
2. 打電話讓我有藉口離開
3. 離開現場後需要找地方待著

---

## ORCA 物件模型

### 核心物件

#### RescueRequest (救援請求)

```json
{
  "object": "RescueRequest",
  "meta": {
    "description": "使用者建立的預約救援請求"
  },
  "relationships": {
    "belongsTo": ["User (creator)"],
    "hasOne": ["Helper (assigned)", "RescueScenario"],
    "hasMany": ["AnnoyingQuestion"]
  },
  "ctas": ["create", "update", "cancel", "selectHelper"],
  "attributes": {
    "id": "string",
    "status": "draft | pending | confirmed | completed | cancelled",
    "scheduledDate": "Date",
    "duration": "number (hours)",
    "stressLevel": "1-5",
    "location": "string",
    "helpNeeded": "string",
    "notes": "string?",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

#### RescueScenario (場景描述)

```json
{
  "object": "RescueScenario",
  "meta": {
    "description": "預期會發生的情境描述"
  },
  "relationships": {
    "belongsTo": ["RescueRequest"]
  },
  "attributes": {
    "description": "string",
    "expectedParticipants": "string? (誰會在場)"
  }
}
```

#### AnnoyingQuestion (惱人問題)

```json
{
  "object": "AnnoyingQuestion",
  "meta": {
    "description": "長輩可能問的尷尬問題"
  },
  "relationships": {
    "belongsTo": ["RescueRequest"]
  },
  "attributes": {
    "content": "string (問題內容)",
    "suggestedResponse": "string? (建議回答)"
  }
}
```

---

## v1 範圍

### 包含
- ✅ 預約制度（非即時）
- ✅ 建立救援請求表單
- ✅ 描述場景與惱人問題
- ✅ 手動選擇 Helper
- ✅ 請求狀態管理

### 不包含 (v2)
- ❌ 即時配對
- ❌ 焦慮按鈕 (Panic Button)
- ❌ 避難地點推薦 (Safe Haven)
- ❌ 地圖上顯示求助氣泡

---

## 表單欄位定義

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `scheduledDate` | Date | ✅ | 預約日期 |
| `duration` | Number | ✅ | 預計時長（小時）|
| `stressLevel` | 1-5 | ✅ | 壓力程度 (1 輕微, 5 煎熬) |
| `location` | String | ✅ | 地點描述 |
| `scenario` | Text | ⚠️ | 場景描述 |
| `questions` | Text[] | ⚠️ | 預期的惱人問題 |
| `helpNeeded` | Text | ✅ | 需要什麼幫助 |
| `notes` | Text | ❌ | 其他備註 |

---

## 狀態流程

```
draft → pending → confirmed → completed
                ↘ cancelled
```

| 狀態 | 說明 | 可執行動作 |
|------|------|-----------|
| draft | 草稿，尚未送出 | 編輯、刪除 |
| pending | 已送出，等待 Helper 確認 | 取消 |
| confirmed | Helper 已確認 | 取消 (需通知) |
| completed | 救援完成 | 評價 |
| cancelled | 已取消 | - |
