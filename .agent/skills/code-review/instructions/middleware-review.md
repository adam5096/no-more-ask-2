---
description: Middleware 審查規範
---

# Middleware Review Instructions

針對 Nuxt 中間件 (Middleware) 的開發，應遵循以下審查準則：

## 1. 認證與授權 (Auth Governance)
- **Fail-Secure 策略**：全域中間件必須預設攔截未認證請求，除非頁面標記為 `public: true`。
- **元數據 (Page Meta)**：
    - `public`: 顯式公開頁面。
    - `auth`: 預設為 `true`，未登入者應跳轉。
    - `devOnly`: 僅在開發環境通行。
- **重定向邏輯**：使用 `navigateTo` 時，確保對匿名用戶與認證用戶有不同的導流策略。

## 2. 會話與狀態恢復 (Session Management)
- **Cookie 優先**：在 SSR 階段應優先從 Cookie (如 `user_info`, `auth_token`) 恢復狀態，避免 Hydration 閃爍。
- **初始化機制**：檢查是否在中間件或 Auth Pinia Store 中正確執行了從 Cookie 到 `useState` 的同步。

## 3. 智慧 404 (Intelligent 404)
- **身份感知**：
    - 認證用戶：放行至 `error.vue`。
    - 匿名用戶：強制重定向至首頁 (資安防護)。
- **路徑檢查**：確認 `to.matched.length === 0` 的處理邏輯。

## 4. 副作用與純粹性 (Side Effects)
- **邏輯抽離**：核心判斷邏輯（如「該用戶是否有權進入此頁面」）應抽離成純函數，以便進行單元測試。
- **避免阻塞**：中間件不應執行過重的異步操作，避免影響首屏加載速度。

## 5. 命名與結構
- **全域性**：全域中間件應後綴 `.global.ts`。
- **權責分離**：單一中間件僅處理單一關注點（如只有 `auth` 或只有 `redirect`）。
