---
description: Session Restoration 與智慧 404 管理規範
---

# Session Management Workflow

本文件定義了專案中處理使用者會話持久化 (Persistence) 與 404 智慧攔截的實作規範，旨在平衡 SSR 補水一致性、SEO 安全性與使用者體驗。

## 1. SSR 友善的會話恢復 (Session Restoration)

為了解決 Nuxt 3 在頁面重新整理 (F5) 時 $useState$ 遺失導致的 UI 狀態閃爍，應遵循以下模式：

### 實作細節
1. **雙重存儲**：
    - `auth_token`: 儲存於 `useCookie` (HttpOnly: false)，作為身份憑證。
    - `user_info`: 儲存於 `useCookie`，包含非敏感資料（email, userId），用於 UI 同步。
2. **初始化機制**：
    - 在 $useAuth$ 初始化時，優先從 `user_info` Cookie 恢復 `useState('user')`。
    ```typescript
    const userInfoCookie = useCookie<User>('user_info')
    const user = useState<User>('user', () => userInfoCookie.value)
    ```

### 優點
- **Hydration 一致性**：伺服器渲染時已有快照，客戶端啟動時不會出現「登入 -> 登出 -> 登入」的閃爍。
- **低耦合**：UI 狀態不依賴 API 重新獲取即可渲染基本資訊。

---

## 2. 智慧 404 攔截 (Intelligent 404 Guard)

根據 ORCA Framework 的概念，我們將路徑視為「對象 (Objects)」之間的「關係 (Relationships)」。對於無效關係 (404)，應區分訪問者身分進行處理。

### 處理原則
- **認證用戶 (Insider)**：
    - **行為**：允許放行至 `error.vue`。
    - **目的**：提供豐富的錯誤訊息與導航建議，保持對象操作的連續性。
- **匿名用戶 (Outsider)**：
    - **行為**：強制重定向至首頁 (`/`)。
    - **目的**：資安防禦，防止外部攻擊者透過探測路徑 (Path Probing) 獲取網站結構資訊。

### Middleware 實作模式
```typescript
if (to.matched.length === 0) {
  if (isAuthenticated.value) return // 放行至 error.vue
  return navigateTo('/') // 安全重定向
}
```

---

## 3. 統一入口規範 (Unified Endpoints)

嚴禁在 Composables 中硬編碼 API 路徑。所有端點應統一維護於 `utils/endpoints.ts`。

- `API_ENDPOINTS`: 前端呼叫 BFF 的路徑。
- `REMOTE_ENDPOINTS`: BFF 呼叫後端的路徑。

---

## 4. OOUX 與 ORCA 應用建議

在設計頁面或處理錯誤時，應從 ORCA 的四個維度思考：
- **Objects**：當前頁面涉及的核心實體是什麼？
- **Relationships**：實體與實體（或用戶）之間的連結是否有效？
- **CTAs**：用戶在當前狀態下最直覺的行動是什麼？
- **Attributes**：該行動具備哪些屬性（安全性、速度、結果預期）？
