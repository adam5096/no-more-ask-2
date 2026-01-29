---
description: 驗證權限守衛決策邏輯
---

> 狀態：初始為 [ ]、完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：驗證權限、function 邏輯

---

## [x] 【驗證權限】公開頁面應直接放行
**範例輸入**：  
- meta: `{ public: true }`
- path: `'/login'`
- matchedCount: `1`
- auth: `{ isAuthenticated: false, isDev: false }`
**期待輸出**：`'allow'`

---

## [x] 【驗證權限】開發環境下的開發專用頁面應放行
**範例輸入**：  
- meta: `{ devOnly: true }`
- path: `'/debug'`
- matchedCount: `1`
- auth: `{ isAuthenticated: false, isDev: true }`
**期待輸出**：`'allow'`

---

## [x] 【驗證權限】首頁路徑應視為隱性公開並放行
**範例輸入**：  
- meta: `{}`
- path: `'/'`
- matchedCount: `1`
- auth: `{ isAuthenticated: false, isDev: false }`
**期待輸出**：`'allow'`

---

## [x] 【驗證權限】已登入者進入 404 路徑應放行（交給 error.vue 處理）
**範例輸入**：  
- meta: `{}`
- path: `'/non-existent'`
- matchedCount: `0`
- auth: `{ isAuthenticated: true, isDev: false }`
**期待輸出**：`'allow'`

---

## [x] 【驗證權限】未登入者進入 404 路徑應重定向至首頁（隱蔽探測）
**範例輸入**：  
- meta: `{}`
- path: `'/non-existent'`
- matchedCount: `0`
- auth: `{ isAuthenticated: false, isDev: false }`
**期待輸出**：`'redirect-home'`

---

## [x] 【驗證權限】未登入者進入私有頁面應重定向至首頁
**範例輸入**：  
- meta: `{}`
- path: `'/dashboard'`
- matchedCount: `1`
- auth: `{ isAuthenticated: false, isDev: false }`
**期待輸出**：`'redirect-home'`

---

## [x] 【驗證權限】已登入者進入私有頁面應放行
**範例輸入**：  
- meta: `{}`
- path: `'/dashboard'`
- matchedCount: `1`
- auth: `{ isAuthenticated: true, isDev: false }`
**期待輸出**：`'allow'`
