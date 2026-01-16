# 會員註冊測試場景清單

> **版本**：v1.0  
> **基於**：`docs/prd/acceptance-criteria.md`、`docs/construction/code-review-checklist.md`  
> **目的**：將驗收標準轉換為具體的測試場景，定義測試優先級和覆蓋率目標

---

## 概述

本文檔將會員註冊功能的驗收標準擴充為詳細的測試場景，並定義測試優先級和覆蓋率目標。測試場景涵蓋全部測試層級：純函數邏輯層、Composables 層、組件層、API 層。

---

## 驗收標準對齊

### 功能驗收標準（來自 `docs/prd/acceptance-criteria.md`）

#### AC-1：用戶可以成功註冊（Email + 密碼 + 暱稱）

**原始驗收標準**：
- [ ] 用戶可以成功註冊（Email + 密碼 + 暱稱）

**擴充後的測試場景**：見下方「詳細測試場景」章節

#### AC-2：註冊失敗時顯示明確的錯誤訊息

**原始驗收標準**：
- [ ] 登入/註冊失敗時顯示明確的錯誤訊息

**擴充後的測試場景**：見下方「詳細測試場景」章節

#### AC-3：註冊成功後導航到登入頁

**原始驗收標準**：
- [ ] 註冊成功後導航到登入頁（用戶需登入後才能獲得 Token）

**擴充後的測試場景**：見下方「詳細測試場景」章節

---

## 詳細測試場景

### 一、純函數邏輯層測試場景

#### 1.1 Email 驗證函數 (`validateEmail`)

**測試場景**：

- **V-EMAIL-001** [P0] 應該驗證正確的 Email 格式
  - 輸入：`test@example.com`
  - 預期輸出：`true`

- **V-EMAIL-002** [P0] 應該拒絕缺少 @ 符號的 Email
  - 輸入：`testexample.com`
  - 預期輸出：`false`

- **V-EMAIL-003** [P0] 應該拒絕缺少域名的 Email
  - 輸入：`test@`
  - 預期輸出：`false`

- **V-EMAIL-004** [P0] 應該拒絕缺少用戶名的 Email
  - 輸入：`@example.com`
  - 預期輸出：`false`

- **V-EMAIL-005** [P0] 應該拒絕空字串
  - 輸入：`''`
  - 預期輸出：`false`

- **V-EMAIL-006** [P1] 應該拒絕只有空格的字串
  - 輸入：`'   '`
  - 預期輸出：`false`

- **V-EMAIL-007** [P1] 應該接受包含加號的 Email
  - 輸入：`test+tag@example.com`
  - 預期輸出：`true`

- **V-EMAIL-008** [P1] 應該接受包含點號的 Email
  - 輸入：`test.name@example.com`
  - 預期輸出：`true`

**測試層級**：純函數邏輯層  
**測試檔案**：`tests/unit/lib/utils/validation.test.ts`

---

#### 1.2 密碼驗證函數 (`validatePassword`)

**測試場景**：

- **V-PWD-001** [P0] 應該驗證非空密碼
  - 輸入：`password123`
  - 預期輸出：`{ valid: true }`

- **V-PWD-002** [P0] 應該拒絕空字串
  - 輸入：`''`
  - 預期輸出：`{ valid: false, error: '請輸入密碼' }`

- **V-PWD-003** [P1] 應該拒絕只有空格的密碼
  - 輸入：`'   '`
  - 預期輸出：`{ valid: false, error: '請輸入密碼' }`

- **V-PWD-004** [P1] 應該驗證密碼最小長度（如需要）
  - 輸入：`'12345'`
  - 預期輸出：`{ valid: false, error: '密碼長度至少 6 個字元' }`

**測試層級**：純函數邏輯層  
**測試檔案**：`tests/unit/lib/utils/validation.test.ts`

---

#### 1.3 暱稱驗證函數 (`validateNickname`)

**測試場景**：

- **V-NICK-001** [P0] 應該驗證非空暱稱
  - 輸入：`'使用者名稱'`
  - 預期輸出：`{ valid: true }`

- **V-NICK-002** [P0] 應該拒絕空字串
  - 輸入：`''`
  - 預期輸出：`{ valid: false, error: '請輸入暱稱' }`

- **V-NICK-003** [P1] 應該拒絕只有空格的暱稱
  - 輸入：`'   '`
  - 預期輸出：`{ valid: false, error: '請輸入暱稱' }`

- **V-NICK-004** [P1] 應該驗證暱稱最大長度（如需要）
  - 輸入：`'a'.repeat(51)`
  - 預期輸出：`{ valid: false, error: '暱稱長度不能超過 50 個字元' }`

**測試層級**：純函數邏輯層  
**測試檔案**：`tests/unit/lib/utils/validation.test.ts`

---

#### 1.4 註冊輸入驗證函數 (`validateRegisterInput`)

**測試場景**：

- **V-REG-001** [P0] 應該驗證所有欄位都正確
  - 輸入：`{ email: 'test@example.com', password: 'password123', nickname: 'Test' }`
  - 預期輸出：`{ valid: true }`

- **V-REG-002** [P0] 應該拒絕 Email 為空
  - 輸入：`{ email: '', password: 'password123', nickname: 'Test' }`
  - 預期輸出：`{ valid: false, error: '請輸入 Email' }`

- **V-REG-003** [P0] 應該拒絕密碼為空
  - 輸入：`{ email: 'test@example.com', password: '', nickname: 'Test' }`
  - 預期輸出：`{ valid: false, error: '請輸入密碼' }`

- **V-REG-004** [P0] 應該拒絕暱稱為空
  - 輸入：`{ email: 'test@example.com', password: 'password123', nickname: '' }`
  - 預期輸出：`{ valid: false, error: '請輸入暱稱' }`

- **V-REG-005** [P0] 應該拒絕 Email 格式錯誤
  - 輸入：`{ email: 'invalid-email', password: 'password123', nickname: 'Test' }`
  - 預期輸出：`{ valid: false, error: 'Email 格式不正確' }`

- **V-REG-006** [P1] 應該同時驗證多個錯誤（優先顯示第一個）
  - 輸入：`{ email: '', password: '', nickname: '' }`
  - 預期輸出：`{ valid: false, error: '請輸入 Email' }`

**測試層級**：純函數邏輯層  
**測試檔案**：`tests/unit/lib/utils/auth.test.ts`

---

#### 1.5 註冊回應處理函數 (`processRegisterResponse`)

**測試場景**：

- **P-RES-001** [P0] 應該處理註冊回應並返回成功訊息
  - 輸入：`{ success: true, message: '註冊成功', user: { id: '1', email: 'test@example.com', nickname: 'Test' } }`
  - 預期輸出：`{ success: true, message: '註冊成功', user: { id: '1', email: 'test@example.com', nickname: 'Test' } }`

- **P-RES-002** [P0] 應該過濾敏感資料（不包含 password 和 token）
  - 輸入：`{ success: true, message: '註冊成功', user: { id: '1', email: 'test@example.com', nickname: 'Test', password: 'secret' }, token: 'token123' }`
  - 預期輸出：`{ success: true, message: '註冊成功', user: { id: '1', email: 'test@example.com', nickname: 'Test' } }`

**測試層級**：純函數邏輯層  
**測試檔案**：`tests/unit/lib/utils/auth.test.ts`

---

### 二、Composables 層測試場景

#### 2.1 認證 Composable (`useAuth`)

**測試場景**：

- **C-AUTH-001** [P0] 應該成功註冊並返回成功訊息
  - 測試重點：呼叫 `register` → API 成功 → 返回成功訊息 → 不儲存 Token → 不更新用戶狀態

- **C-AUTH-002** [P0] 應該處理註冊錯誤
  - 測試重點：呼叫 `register` → API 返回錯誤 → 錯誤訊息正確顯示

- **C-AUTH-003** [P0] 應該處理網路錯誤
  - 測試重點：呼叫 `register` → 網路錯誤 → 顯示網路錯誤訊息

- **C-AUTH-004** [P0] 應該處理 Email 已被註冊錯誤
  - 測試重點：呼叫 `register` → API 返回 409 → 顯示「Email 已被註冊」

- **C-AUTH-005** [P0] 應該在註冊成功後導航到登入頁
  - 測試重點：呼叫 `register` → 成功 → 導航到 `/login`

- **C-AUTH-006** [P0] 應該不儲存 Token（註冊階段不簽發 Token）
  - 測試重點：呼叫 `register` → 成功 → 不呼叫 `useCookie` 儲存 Token

- **C-AUTH-007** [P0] 應該不更新用戶狀態（註冊階段不載入用戶資訊）
  - 測試重點：呼叫 `register` → 成功 → 不呼叫 `useState` 更新用戶資訊

- **C-AUTH-008** [P1] 應該顯示載入狀態
  - 測試重點：呼叫 `register` → `isLoading` 為 `true` → API 完成後為 `false`

**測試層級**：Composables 層  
**測試檔案**：`tests/integration/composables/useAuth.test.ts`  
**Mock 需求**：Mock `$fetch`、`navigateTo`

---

### 三、組件層測試場景

#### 3.1 註冊頁面組件 (`pages/register.vue`)

**測試場景**：

- **UI-REG-001** [P0] 應該正確渲染註冊表單
  - 測試重點：表單欄位（Email、密碼、暱稱）正確顯示

- **UI-REG-002** [P0] 應該在前端驗證 Email 格式
  - 測試重點：輸入無效 Email → 顯示錯誤訊息

- **UI-REG-003** [P0] 應該在前端驗證必填欄位
  - 測試重點：提交空表單 → 顯示錯誤訊息

- **UI-REG-004** [P0] 應該在表單提交時顯示載入狀態
  - 測試重點：點擊提交 → 按鈕顯示 loading 狀態

- **UI-REG-005** [P0] 應該在註冊成功後導航到登入頁
  - 測試重點：提交成功 → 顯示成功訊息 → 導航到 `/login`

- **UI-REG-006** [P0] 應該顯示 API 錯誤訊息
  - 測試重點：API 返回錯誤 → 錯誤訊息正確顯示

- **UI-REG-007** [P0] 應該顯示 Email 已被註冊錯誤
  - 測試重點：API 返回 409 → 顯示「Email 已被註冊」

- **UI-REG-008** [P0] 應該顯示網路錯誤訊息
  - 測試重點：網路錯誤 → 顯示「網路連線失敗，請稍後再試」

- **UI-REG-009** [P1] 應該在表單提交時禁用表單欄位
  - 測試重點：提交中 → 表單欄位 disabled

- **UI-REG-010** [P1] 應該支援鍵盤導航
  - 測試重點：Tab 鍵可以在表單欄位間移動

- **UI-REG-011** [P1] 應該支援 Enter 鍵提交表單
  - 測試重點：在表單中按 Enter → 提交表單

**測試層級**：組件層  
**測試檔案**：`tests/components/pages/register.test.ts`  
**測試工具**：`@testing-library/vue`  
**Mock 需求**：Mock `useAuth` Composable

---

### 四、API 層測試場景

#### 4.1 註冊 API (`server/api/auth/register.post.ts`)

**測試場景**：

- **API-REG-001** [P0] 應該成功註冊新用戶
  - 請求：`POST /api/auth/register`，`{ email: 'test@example.com', password: 'password123', nickname: 'Test' }`
  - 預期回應：`200`，`{ success: true, message: '註冊成功', user: { id: '...', email: '...', nickname: '...' } }`

- **API-REG-002** [P0] 應該拒絕 Email 為空的請求
  - 請求：`POST /api/auth/register`，`{ email: '', password: 'password123', nickname: 'Test' }`
  - 預期回應：`400`，`{ statusMessage: 'Email、密碼和暱稱不能為空' }`

- **API-REG-003** [P0] 應該拒絕密碼為空的請求
  - 請求：`POST /api/auth/register`，`{ email: 'test@example.com', password: '', nickname: 'Test' }`
  - 預期回應：`400`，`{ statusMessage: 'Email、密碼和暱稱不能為空' }`

- **API-REG-004** [P0] 應該拒絕暱稱為空的請求
  - 請求：`POST /api/auth/register`，`{ email: 'test@example.com', password: 'password123', nickname: '' }`
  - 預期回應：`400`，`{ statusMessage: 'Email、密碼和暱稱不能為空' }`

- **API-REG-005** [P0] 應該拒絕 Email 已被註冊的請求
  - 請求：`POST /api/auth/register`，`{ email: 'existing@example.com', password: 'password123', nickname: 'Test' }`
  - 預期回應：`409`，`{ statusMessage: 'Email 已被註冊' }`

- **API-REG-006** [P0] 應該不返回 Token（註冊階段不簽發 Token）
  - 請求：成功註冊
  - 預期回應：回應中不包含 `token` 欄位

- **API-REG-007** [P0] 應該返回正確的用戶資訊格式
  - 請求：成功註冊
  - 預期回應：用戶資訊包含 `id`、`email`、`nickname`、`avatar`、`role`（不包含 `token`）

- **API-REG-008** [P0] 應該不返回敏感資料（password 和 token）
  - 請求：成功註冊
  - 預期回應：回應中不包含 `password`、`passwordHash` 或 `token`

- **API-REG-009** [P1] 應該正確創建新用戶
  - 請求：成功註冊
  - 預期回應：新用戶被加入 `mockUsers` 陣列

**測試層級**：API 層  
**測試檔案**：`tests/api/auth/register.post.test.ts`  
**測試工具**：`@nuxt/test-utils`  
**Mock 需求**：Mock `mockUsers` 陣列

---

## 測試優先級定義

### 優先級說明

- **P0（必須完成）**：MVP 核心場景，必須在 Phase 1 完成
- **P1（建議完成）**：擴展場景，可在 Phase 2+ 完成

### 優先級統計

- **P0（必須完成）**：29 個場景
  - 純函數層：8 個
  - Composables 層：7 個
  - 組件層：8 個
  - API 層：6 個

- **P1（建議完成）**：6 個場景
  - 純函數層：4 個
  - Composables 層：1 個
  - 組件層：3 個
  - API 層：1 個

- **總計**：35 個場景
  - 純函數層：12 個
  - Composables 層：8 個
  - 組件層：11 個
  - API 層：6 個

---

## 測試覆蓋率目標

### 各層級覆蓋率目標

- **純函數邏輯層**：100%
  - 說明：純函數應該達到 100% 覆蓋率，因為它們是核心業務邏輯

- **Composables 層**：80%+
  - 說明：Composables 組合邏輯和副作用處理，目標 80%+

- **組件層**：70%+
  - 說明：組件 UI 和互動邏輯，目標 70%+

- **API 層**：80%+
  - 說明：API 端點行為和錯誤處理，目標 80%+

### MVP 階段（Phase 1）覆蓋率目標

- **純函數邏輯層**：100%
  - 說明：所有 P0 場景必須測試

- **Composables 層**：80%+
  - 說明：所有 P0 場景必須測試

- **組件層**：70%+
  - 說明：所有 P0 場景必須測試

- **API 層**：80%+
  - 說明：所有 P0 場景必須測試

---

## 測試場景與驗收標準對照表

### AC-1：用戶可以成功註冊（Email + 密碼 + 暱稱）

- **輸入正確的 Email、密碼、暱稱 → 成功註冊**
  - 對應測試場景：V-REG-001, C-AUTH-001, UI-REG-005, API-REG-001
  - 測試層級：全部層級

- **註冊成功後返回成功訊息和用戶基本資訊（不包含 token）**
  - 對應測試場景：C-AUTH-001, API-REG-001, API-REG-006, API-REG-007
  - 測試層級：Composables、API

- **不儲存 Token（註冊階段不簽發 Token）**
  - 對應測試場景：C-AUTH-006, API-REG-006
  - 測試層級：Composables、API

- **不更新用戶狀態（註冊階段不載入用戶資訊）**
  - 對應測試場景：C-AUTH-007
  - 測試層級：Composables

- **自動導航到登入頁**
  - 對應測試場景：C-AUTH-005, UI-REG-005
  - 測試層級：Composables、組件

### AC-2：註冊失敗時顯示明確的錯誤訊息

- **Email 為空 → 顯示「請輸入 Email」**
  - 對應測試場景：V-REG-002, UI-REG-003, API-REG-002
  - 測試層級：全部層級

- **密碼為空 → 顯示「請輸入密碼」**
  - 對應測試場景：V-REG-003, UI-REG-003, API-REG-003
  - 測試層級：全部層級

- **暱稱為空 → 顯示「請輸入暱稱」**
  - 對應測試場景：V-REG-004, UI-REG-003, API-REG-004
  - 測試層級：全部層級

- **Email 格式錯誤 → 顯示「Email 格式不正確」**
  - 對應測試場景：V-REG-005, UI-REG-002
  - 測試層級：純函數、組件

- **Email 已被註冊 → 顯示「Email 已被註冊」**
  - 對應測試場景：C-AUTH-004, UI-REG-007, API-REG-005
  - 測試層級：Composables、組件、API

- **網路錯誤 → 顯示「網路連線失敗，請稍後再試」**
  - 對應測試場景：C-AUTH-003, UI-REG-008
  - 測試層級：Composables、組件

### AC-3：註冊成功後導航到登入頁

- **註冊成功後顯示成功訊息**
  - 對應測試場景：C-AUTH-001, UI-REG-005
  - 測試層級：Composables、組件

- **註冊成功後導航到登入頁**
  - 對應測試場景：C-AUTH-005, UI-REG-005
  - 測試層級：Composables、組件

- **註冊階段不簽發 Token（Token 在登入階段簽發）**
  - 對應測試場景：C-AUTH-006, API-REG-006
  - 測試層級：Composables、API

---

## 測試執行順序建議

### 階段性執行順序

1. **階段 2：純函數邏輯層測試**
   - 優先執行：所有 P0 場景
   - 目標：100% 覆蓋率

2. **階段 3：Composables 層測試**
   - 優先執行：所有 P0 場景
   - 目標：80%+ 覆蓋率

3. **階段 4：組件層測試**
   - 優先執行：所有 P0 場景
   - 目標：70%+ 覆蓋率

4. **階段 5：API 層測試**
   - 優先執行：所有 P0 場景
   - 目標：80%+ 覆蓋率

5. **階段 6：整合測試與驗收**
   - 執行端到端測試場景
   - 對照驗收標準檢查
   - 生成測試覆蓋率報告

---

## 測試檔案結構

```
tests/
├── unit/                          # 單元測試（純函數）
│   └── lib/
│       └── utils/
│           ├── validation.test.ts  # 驗證函數測試（V-EMAIL-*, V-PWD-*, V-NICK-*）
│           └── auth.test.ts        # 認證相關純函數測試（V-REG-*, P-RES-*）
│
├── integration/                   # 整合測試（Composables）
│   └── composables/
│       └── useAuth.test.ts        # 認證 Composable 測試（C-AUTH-*）
│
├── components/                    # 組件測試
│   └── pages/
│       └── register.test.ts       # 註冊頁面組件測試（UI-REG-*）
│
└── api/                           # API 測試
    └── auth/
        └── register.post.test.ts  # 註冊 API 測試（API-REG-*）
```

---

## 相關文檔

- **驗收標準**：`docs/prd/acceptance-criteria.md`
- **Code Review 檢查清單**：`docs/construction/code-review-checklist.md`
- **編程範式文檔**：`docs/construction/programming-paradigms/index.md`
- **測試工作流程**：`docs/construction/testing/register-test-workflow.md`（計劃文件）

---

**文檔版本**：v1.0  
**最後更新**：2025  
**維護者**：待指定

