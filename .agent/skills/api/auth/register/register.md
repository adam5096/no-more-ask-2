---
name: 串接 會員註冊 API
description: 串接 會員註冊 API
---

# 串接 會員註冊 API

當前任務是 "串接 會員註冊 API"，請設計施工步驟和關注點

## 施工步驟

STEP：根據外部後端團隊提供的 JSON、Schema 如下：

STEP： HTTP Methods：POST

request JSON：注意，value 值僅為展示資料參考格式，並非真實數據，提供你類推
{
  "email": "user@example.com",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "displayName": "string"
}

response JSON：注意，value 值僅為展示資料參考格式，並非真實數據，提供你類推
{
    "token": "***",
    "email": "***",
    "userId": "***"
}

Schema：
RegisterDTO：其中欄位出現 "*" 表示必填
{
email*	    string($email); minLength: 1;
password*	string; minLength: 6;
firstName*	string; minLength: 1;
lastName*	string; minLength: 1;
displayName	string; nullable: true;
}

STEP：外部後端端點如下：`****`
提醒前端人員查找：
1 postman 設定檔位置

STEP：
**驗證時機**：採用失焦驗證
**錯誤回饋**：顯示在各別欄位下方
**displayName 處理**：當欄位為空時，發送 null

STEP：根據 Nitro Endpoint 設計規範請參考 `.agent\workflows\construction\nitro\bff-paths.md`

STEP：請評估註冊事件基本資訊如下：
**觸發元件**：如果設計成父、子結構，請合理安排統一由父層管理所有事件和狀態，並向後代元件派發事件和狀態，形成可追蹤狀態流動。如果只有單層元件結構，則統一在當代元件管理事件與狀態。
**元件中的元素**：觸發事件的起點
**狀態生命週期**：設計狀態的變化是否符合使用者需求
**元件生命週期**：理解合理管理元件的創造與銷毀

STEP：請評估該事件為同步或是非同步任務

STEP：如果是非同步任務，請評估是否需要加入狀態鎖和 UI/UX 優雅處理

STEP：請評估使用 $fetch、useFetch、useAsyncData 的適合度，並注意各自的使用限制，請參考 `.agent\workflows\construction\data-fetching\useFetch.md`

**最後 請先與我討論，並確認下列幾點**
STEP ：上述規範可行
STEP ：規則之間零衝突，沒有引起你的困惑；如有困惑與好奇，請向我提問
STEP ：貼合需求
STEP ：任務關注點切分合理，每次工作量不會過多過長
STEP FINAL：取得我同意後才能修改程式碼

## 如何提供回饋給我

- 清楚說明需要修改的地方
- 解釋原因，而不僅僅是說明需要修改的地方
- 提供替代方案