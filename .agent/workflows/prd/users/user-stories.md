---
description: 基於產品需求文件（PRD）v1.0、功能清單；為每個主要功能撰寫標準格式的使用者故事，連結功能與使用者目標
---

# 使用者故事集合

---

## 使用者故事格式說明

每個使用者故事遵循以下格式：

```
As a [角色]
I want to [動作]
So that [目標/價值]
```

**驗收條件（Acceptance Criteria）**：
- Given [前置條件]
- When [動作]
- Then [預期結果]

---

## Phase 1（MVP - 最精簡核心）

### 認證系統

#### US-001：作為新用戶，我想要註冊帳號

**使用者故事**：
```
As a 新用戶
I want to 使用 Email 和密碼註冊帳號
So that 我可以使用平台的所有功能
```

**驗收條件**：
- Given 用戶在註冊頁面
- When 用戶輸入有效的 Email、密碼、確認密碼和暱稱，並點擊註冊
- Then 系統創建帳號，用戶自動登入，並導航到個人儀表板

**優先級**：P0  
**Phase**：Phase 1

---

#### US-002：作為已註冊用戶，我想要登入帳號

**使用者故事**：
```
As a 已註冊用戶
I want to 使用 Email 和密碼登入
So that 我可以存取我的個人資料和使用平台功能
```

**驗收條件**：
- Given 用戶在登入頁面
- When 用戶輸入正確的 Email 和密碼，並點擊登入
- Then 系統驗證憑證，用戶登入成功，並導航到個人儀表板
- And 系統記住登入狀態（如果選擇「記住我」）

**優先級**：P0  
**Phase**：Phase 1

---

### 救援功能（B1 避難中心）

#### US-003：作為 Escapee，我想要建立救援請求

**使用者故事**：
```
As an Escapee（焦慮的求助者）
I want to 快速建立救援請求，設定壓力等級和預算
So that 系統可以自動匹配 Helper，幫助我應對節慶壓力
```

**驗收條件**：
- Given Escapee 已登入系統
- When Escapee 選擇請求類型、設定壓力等級（1-5）、輸入預算和描述、選擇地理位置
- Then 系統創建救援請求，自動匹配 Helper，並發送通知
- And Escapee 可以查看請求詳情頁面

**優先級**：P0  
**Phase**：Phase 1  
**相關功能**：建立救援請求、救援請求詳情

---

#### US-004：作為 Escapee，我想要查看救援請求狀態

**使用者故事**：
```
As an Escapee
I want to 查看救援請求的狀態和匹配的 Helper 資訊
So that 我可以了解救援進度並聯繫 Helper
```

**驗收條件**：
- Given Escapee 已建立救援請求
- When Escapee 查看救援請求詳情頁面
- Then 系統顯示請求狀態、匹配的 Helper 資訊、地圖位置
- And Escapee 可以取消請求（僅 pending 狀態）

**優先級**：P0  
**Phase**：Phase 1  
**相關功能**：救援請求詳情

---

#### US-005：作為 SilentBuffer，我想要建立救援請求

**使用者故事**：
```
As a SilentBuffer（夾心餅乾配偶）
I want to 建立救援請求
So that 我可以獲得即時支援，應對伴侶家庭的節慶聚會壓力
```

**驗收條件**：
- Given SilentBuffer 已登入系統
- When SilentBuffer 建立救援請求
- Then 系統創建請求並匹配 Helper
- And SilentBuffer 可以獲得即時救援支援

**優先級**：P0  
**Phase**：Phase 1  
**相關功能**：建立救援請求

---

### Helper 功能（B4 英雄榜）

#### US-006：作為用戶，我想要註冊成為 Helper

**使用者故事**：
```
As a 用戶
I want to 註冊成為 Helper，填寫技能標籤和個人簡介
So that 我可以提供救援服務並獲得報酬或成就感
```

**驗收條件**：
- Given 用戶已登入系統
- When 用戶填寫個人簡介、選擇技能標籤、設定時薪，並提交註冊
- Then 系統創建 Helper 檔案，用戶可以開始接案
- And 用戶導航到 Helper 儀表板

**優先級**：P0  
**Phase**：Phase 1  
**相關功能**：Helper 註冊

---

#### US-007：作為 Helper，我想要查看可接案件

**使用者故事**：
```
As a Helper
I want to 在 Helper 儀表板查看可接案件列表
So that 我可以選擇合適的案件並提供服務
```

**驗收條件**：
- Given Helper 已註冊並登入
- When Helper 查看 Helper 儀表板
- Then 系統顯示可接案件列表、進行中案件、歷史案件
- And Helper 可以切換狀態（在線/離線）以控制是否接收案件

**優先級**：P0  
**Phase**：Phase 1  
**相關功能**：Helper 儀表板

---

#### US-008：作為 Helper，我想要接受救援請求

**使用者故事**：
```
As a Helper
I want to 接受救援請求
So that 我可以開始提供救援服務並獲得報酬
```

**驗收條件**：
- Given Helper 在線且看到可接案件
- When Helper 點擊接受救援請求
- Then 系統更新請求狀態為「進行中」，發送通知給 Escapee
- And Helper 可以查看案件詳情並開始服務

**優先級**：P0  
**Phase**：Phase 1  
**相關功能**：Helper 儀表板、救援請求詳情

---

### 個人儀表板

#### US-009：作為用戶，我想要查看個人儀表板

**使用者故事**：
```
As a 用戶
I want to 查看個人儀表板，了解我的基本資訊和快速操作
So that 我可以快速存取常用功能
```

**驗收條件**：
- Given 用戶已登入
- When 用戶查看個人儀表板
- Then 系統顯示用戶資訊卡片（頭像、名稱、角色）、快速操作按鈕、通知中心入口
- And 用戶可以快速建立請求或查看通知

**優先級**：P0  
**Phase**：Phase 1  
**相關功能**：個人儀表板（簡化版）

---

### 通知系統（B7 Line 即時通）

#### US-010：作為用戶，我想要查看通知列表

**使用者故事**：
```
As a 用戶
I want to 查看系統通知列表
So that 我可以及時了解救援匹配、聚會邀請等重要資訊
```

**驗收條件**：
- Given 用戶已登入
- When 用戶查看通知中心
- Then 系統顯示所有通知列表，支援全部/未讀/已讀篩選
- And 用戶可以點擊通知標記為已讀並導航到相關頁面

**優先級**：P0  
**Phase**：Phase 1  
**相關功能**：通知列表、通知篩選

---

## Phase 2（擴展核心功能）

### 應對錦囊（B2）

#### US-011：作為 Escapee，我想要生成應對腳本

**使用者故事**：
```
As an Escapee
I want to 輸入長輩問話並生成應對腳本
So that 我可以有效應對長輩的尷尬或侵略性問話
```

**驗收條件**：
- Given Escapee 已登入
- When Escapee 輸入長輩問話內容，選擇語氣（幽默/冷漠/擺爛），並生成腳本
- Then 系統生成對應的應對腳本和肢體語言建議
- And Escapee 可以複製腳本或收藏常用腳本

**優先級**：P1  
**Phase**：Phase 2  
**相關功能**：生成腳本、腳本顯示、收藏功能

---

#### US-012：作為 SilentBuffer，我想要使用應對腳本

**使用者故事**：
```
As a SilentBuffer
I want to 使用應對腳本應對伴侶家庭的長輩問話
So that 我可以維持客氣但有效應對，減少壓力
```

**驗收條件**：
- Given SilentBuffer 已登入
- When SilentBuffer 生成應對腳本
- Then 系統提供可複製的腳本和肢體語言建議
- And SilentBuffer 可以在現場使用腳本應對

**優先級**：P1  
**Phase**：Phase 2  
**相關功能**：應對錦囊

---

### 取暖牆（B5）

#### US-013：作為 SilentBuffer，我想要發布匿名貼文

**使用者故事**：
```
As a SilentBuffer
I want to 在取暖牆發布匿名貼文，宣洩節慶壓力
So that 我可以獲得同溫層的共感支持，減輕心理負擔
```

**驗收條件**：
- Given SilentBuffer 已登入
- When SilentBuffer 選擇匿名模式，輸入貼文內容，並發布
- Then 系統發布匿名貼文到取暖牆
- And 其他用戶可以看到貼文並按讚或留言

**優先級**：P1  
**Phase**：Phase 2  
**相關功能**：貼文流、匿名發布

---

#### US-014：作為 UrbanLoner，我想要發起聚會

**使用者故事**：
```
As an UrbanLoner（節慶邊緣人）
I want to 發起節慶聚會，設定時間、地點和人數上限
So that 我可以找到志同道合的夥伴，一起度過節慶
```

**驗收條件**：
- Given UrbanLoner 已登入
- When UrbanLoner 設定聚會標題、描述、時間、地點、人數上限，並提交
- Then 系統創建聚會，顯示在聚會列表和實況地圖上
- And UrbanLoner 可以查看聚會詳情和管理參與者

**優先級**：P1  
**Phase**：Phase 2  
**相關功能**：發起聚會、聚會詳情

---

#### US-015：作為 UrbanLoner，我想要參與他人發起的聚會

**使用者故事**：
```
As an UrbanLoner
I want to 瀏覽聚會列表並參與感興趣的聚會
So that 我可以找到志同道合的夥伴，減少節慶期間的孤立感
```

**驗收條件**：
- Given UrbanLoner 已登入
- When UrbanLoner 瀏覽聚會列表，查看聚會詳情，並點擊加入
- Then 系統將 UrbanLoner 加入聚會參與者列表
- And UrbanLoner 可以查看聚會詳情和參與者資訊

**優先級**：P1  
**Phase**：Phase 2  
**相關功能**：聚會列表、聚會詳情、參與聚會

---

### Helper 功能擴展

#### US-016：作為 Helper，我想要查看我的業績統計

**使用者故事**：
```
As a Helper
I want to 查看我的業績統計和評價列表
So that 我可以了解我的服務表現並建立信任
```

**驗收條件**：
- Given Helper 已註冊並完成至少一個案件
- When Helper 查看 Helper 個人檔案
- Then 系統顯示業績統計（完成案件數、平均評價、總收入）、評價列表
- And Helper 可以了解自己的服務表現

**優先級**：P1  
**Phase**：Phase 2  
**相關功能**：Helper 檔案、業績統計

---

## Phase 3（診斷與地圖）

### 角色診斷（B3）

#### US-017：作為 Escapee，我想要進行角色診斷

**使用者故事**：
```
As an Escapee
I want to 進行晚輩端測驗，了解我的心理陰影面積
So that 我可以了解自己的社交模式並判斷是否需要啟動 SOS
```

**驗收條件**：
- Given Escapee 已登入
- When Escapee 選擇晚輩端測驗，回答測驗問題，並提交答案
- Then 系統生成診斷報告，顯示心理陰影面積、社交標籤、處方箋
- And Escapee 可以查看報告並決定是否啟動救援

**優先級**：P2  
**Phase**：Phase 3  
**相關功能**：開始測驗、提交答案、診斷報告

---

#### US-018：作為 WokeElder，我想要進行角色診斷

**使用者故事**：
```
As a WokeElder（覺醒的長輩）
I want to 進行長輩端測驗，了解我是在提要求還是在提需求
So that 我可以改善與後輩的溝通方式，避免被貼上「討人厭」標籤
```

**驗收條件**：
- Given WokeElder 已註冊（可選）
- When WokeElder 選擇長輩端測驗，回答測驗問題，並提交答案
- Then 系統生成診斷報告，顯示處方箋和溝通建議
- And WokeElder 可以了解自己的溝通模式並改善

**優先級**：P2  
**Phase**：Phase 3  
**相關功能**：開始測驗、提交答案、診斷報告

---

### 實況地圖（B6）

#### US-019：作為 Helper，我想要查看實況地圖

**使用者故事**：
```
As a Helper
I want to 查看實況地圖，了解救援點和避難空間的位置
So that 我可以選擇合適的案件並規劃服務路線
```

**驗收條件**：
- Given Helper 已登入
- When Helper 查看實況地圖
- Then 系統顯示救援點、Helper 位置、避難空間、熱力分布
- And Helper 可以切換圖層，點擊地圖標記查看詳情

**優先級**：P2  
**Phase**：Phase 3  
**相關功能**：地圖視覺化、圖層切換

---

#### US-020：作為 UrbanLoner，我想要查看邊緣人座標

**使用者故事**：
```
As an UrbanLoner
I want to 在實況地圖查看其他邊緣人的座標
So that 我可以找到附近的志同道合夥伴，發起或參與聚會
```

**驗收條件**：
- Given UrbanLoner 已登入
- When UrbanLoner 查看實況地圖，切換到邊緣人座標圖層
- Then 系統顯示邊緣人座標和相關聚會資訊
- And UrbanLoner 可以點擊座標查看詳情並發起聚會

**優先級**：P2  
**Phase**：Phase 3  
**相關功能**：地圖視覺化、邊緣人座標

---

## Phase 4（邊界管理）

### 邊界說明書（B8）

#### US-021：作為 Escapee，我想要建立邊界說明書

**使用者故事**：
```
As an Escapee
I want to 建立個人社交邊界說明書，勾選接受與不接受的話題
So that 我可以提前對齊溝通預期，減少節慶期間的尷尬問話
```

**驗收條件**：
- Given Escapee 已登入
- When Escapee 勾選接受與不接受的話題列表，並生成分享連結
- Then 系統創建邊界說明書，生成專屬分享 URL
- And Escapee 可以分享連結給親友，提前對齊溝通預期

**優先級**：P2  
**Phase**：Phase 4  
**相關功能**：編輯邊界、分享功能

---

#### US-022：作為 WokeElder，我想要查看後輩的邊界說明書

**使用者故事**：
```
As a WokeElder
I want to 查看後輩分享的邊界說明書
So that 我可以了解後輩的溝通邊界，避免觸及禁忌話題
```

**驗收條件**：
- Given WokeElder 收到邊界說明書分享連結
- When WokeElder 點擊連結查看邊界說明書
- Then 系統顯示後輩設定的接受與不接受話題列表
- And WokeElder 可以了解溝通邊界並調整溝通方式

**優先級**：P2  
**Phase**：Phase 4  
**相關功能**：邊界說明書分享頁

---

## 使用者故事對照表

| 使用者故事 ID | 角色 | 功能 | Phase | 優先級 |
|-------------|------|------|-------|--------|
| US-001 | 新用戶 | 註冊帳號 | Phase 1 | P0 |
| US-002 | 已註冊用戶 | 登入帳號 | Phase 1 | P0 |
| US-003 | Escapee | 建立救援請求 | Phase 1 | P0 |
| US-004 | Escapee | 查看救援請求狀態 | Phase 1 | P0 |
| US-005 | SilentBuffer | 建立救援請求 | Phase 1 | P0 |
| US-006 | 用戶 | 註冊成為 Helper | Phase 1 | P0 |
| US-007 | Helper | 查看可接案件 | Phase 1 | P0 |
| US-008 | Helper | 接受救援請求 | Phase 1 | P0 |
| US-009 | 用戶 | 查看個人儀表板 | Phase 1 | P0 |
| US-010 | 用戶 | 查看通知列表 | Phase 1 | P0 |
| US-011 | Escapee | 生成應對腳本 | Phase 2 | P1 |
| US-012 | SilentBuffer | 使用應對腳本 | Phase 2 | P1 |
| US-013 | SilentBuffer | 發布匿名貼文 | Phase 2 | P1 |
| US-014 | UrbanLoner | 發起聚會 | Phase 2 | P1 |
| US-015 | UrbanLoner | 參與聚會 | Phase 2 | P1 |
| US-016 | Helper | 查看業績統計 | Phase 2 | P1 |
| US-017 | Escapee | 進行角色診斷 | Phase 3 | P2 |
| US-018 | WokeElder | 進行角色診斷 | Phase 3 | P2 |
| US-019 | Helper | 查看實況地圖 | Phase 3 | P2 |
| US-020 | UrbanLoner | 查看邊緣人座標 | Phase 3 | P2 |
| US-021 | Escapee | 建立邊界說明書 | Phase 4 | P2 |
| US-022 | WokeElder | 查看邊界說明書 | Phase 4 | P2 |

---

**文檔版本**：v1.0  
**最後更新**：2025  
**維護者**：待指定

