---
name: 串接 會員登出 API
description: 串接 會員登出 API 施工步驟指南
---

# 串接 會員登出 API

當前任務是 "串接 會員登出 API"，請設計施工步驟和關注點

## 施工步驟

STEP：根據外部後端團隊提供的 JSON、Schema 如下：
`.agent\skills\api\auth\logout\resource\api-logout-schema.md`

STEP：
**驗證時機**：採用失焦驗證

**錯誤回饋**：顯示在各別欄位下方

**displayName 處理**：當欄位為空時，發送 null

STEP：根據 Nitro Endpoint 設計規範請參考 `.agent\workflows\construction\nitro\bff-paths.md`

STEP：請評估登出事件基本資訊如下：
**定位登出觸發元件**：（ 必要 ）如果設計成父、子結構，請合理安排統一由父層管理所有事件和狀態，並向後代元件派發事件和狀態，形成可追蹤狀態流動。如果只有單層元件結構，則統一在當代元件管理事件與狀態。

**詢問完成登出事件後的下一步**：（ 必要 ）向前端人員確認是否需要跳轉到登入頁面

**定位元件中的元素**：（ 必要 ）定位觸發事件的起點元素，即 event.target 是哪個 DOM 元素

**盤點狀態生命週期**：（ 必要 ）設計狀態的變化是否符合使用者需求

**元件生命週期**：（ 可選 ）理解合理管理元件的創造與銷毀


STEP：請評估該事件為同步或是非同步任務

STEP：如果是非同步任務，請評估是否需要加入狀態鎖和 UI/UX 優雅處理

STEP：請評估使用 $fetch、useFetch、useAsyncData 的適合度，並注意各自的使用限制，請參考 `.agent\workflows\construction\data-fetching\useFetch.md`

STEP：分享一下你設計的登出 pipline 中，各系統（ 前端 、BFF、外部後端 ）循序是什麼樣子？

STEP：登出 pipline 中非同步任務等候處理，你想如何設計這段等待時間的 UIUX ？

STEP：目前註冊、登入、登出，三者 pipeline 中的非同步等候時間的 UIUX 有統一且一致的 UIUX 嗎?

**最後 請先與我討論，並確認下列幾點**
確認：上述提及 STEP 可行性與適合度

確認：規則之間零衝突或低衝突，沒有引起你的困惑；如有困惑與好奇，可檢查有無註解例外狀況的指南，若缺少指南請向我詢問與補充。

確認：貼合需求

確認：任務關注點切分合理，每次工作量不會過多過長


最後確認：取得我同意後才能修改程式碼

## 如何提供回饋給我

STEP：清楚說明需要修改的地方

STEP：解釋原因，而不僅僅是說明需要修改的地方

STEP：提供替代方案