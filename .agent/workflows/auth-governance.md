---
description: 認證與授權治理規範 (Auth Governance)
---

# 認證與授權治理規範

本文件定義專案中如何確保頁面安全性，並提供開發期與生產環境之間的平衡策略。

## 1. 核心原則：Fail-Secure (預設安全)

專案採用 **「預設封鎖」** 策略。除非頁面顯式宣告為公開，否則全域中間件（Global Middleware）將攔截所有未經認證的請求。

## 2. 頁面元數據 (Page Meta) 規範

透過 `definePageMeta` 來控制頁面的存取權限：

| 屬性名 | 類型 | 說明 |
| :--- | :--- | :--- |
| `public` | `boolean` | **顯式公開**。任何用戶（包含未登入者）皆可訪問。常用於首頁、登入頁。 |
| `auth` | `boolean` | **認證保護**。預設為 `true`。若未設定則視為需要認證。 |
| `devOnly` | `boolean` | **開發期繞過**。僅在 `process.dev` 為 true 時可跳過認證，用於切版階段預覽。 |

## 3. 全域中間件邏輯 (SOP)

`middleware/auth.global.ts` 應遵循以下邏輯順序：

1. **白名單檢查**：檢查 `to.meta.public`。若是則通行。
2. **環境檢查**：若為開發環境 (`process.dev`) 且 `to.meta.devOnly` 為真，則通行。
3. **認證檢查**：檢查 `isAuthenticated`。若為假，重定向至 `/` (或 `/login`)。

## 4. 避免遺忘的提醒機制

1. **開發標籤**：在開發模式下，如果一個頁面是透過 `devOnly` 或 `public` 開放的，應在佈局中顯示「開發預覽模式」或「公開頁面」的浮動提示。
2. **ESLint 檢查**：(待實作) 掃描 `pages/dashboard` 下的檔案是否漏掉 `auth` 定義。

## 5. 轉換流程 (Promotion Workflow)

從 **切版** 轉向 **功能實作** 時：
- [ ] 移除 `definePageMeta({ devOnly: true })`。
- [ ] 確保頁面未加上 `public: true`（除非是公共資訊頁）。
- [ ] 驗證未登入用戶進入該路由是否被正確彈回。
