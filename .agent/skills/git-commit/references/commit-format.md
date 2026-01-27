# Git Commit Message 規範

基於「約定式提交 (Conventional Commits)」規範。

---

## 提交結構

```
<類型>[可選的範圍]: <主題描述>

[可選的正文]

[可選的頁腳]
```

---

## 類型 (Type) - 必需

| 類型 | 說明 |
|------|------|
| `feat` | 新增功能 (feature) |
| `fix` | 修復 Bug |
| `docs` | 文件相關修改 |
| `style` | 格式調整（不影響邏輯）|
| `refactor` | 重構（非新功能、非修 Bug）|
| `perf` | 效能優化 |
| `test` | 測試相關 |
| `build` | 建構系統或外部依賴 |
| `ci` | CI/CD 設定 |
| `chore` | 其他雜項事務 |

---

## 主題 (Subject) - 必需

- 使用**祈使句**（如：add, fix, update）
- 開頭不大寫
- 結尾不加句號

---

## 頁腳 (Footer) - 可選

- **重大更新**：以 `BREAKING CHANGE:` 開頭
- **關聯 Issue**：使用 `Closes #123`, `Fixes #456`

---

## 範例

### ✅ 正確

```bash
# 簡單
feat: 新增使用者頭像上傳功能

# 完整
fix(api): 修正使用者資料驗證邏輯

先前的驗證邏輯過於寬鬆，允許無效的 email 格式註冊。

Closes: #245
BREAKING CHANGE: POST /api/users 端點現在對無效 email 回傳 400
```

### ❌ 錯誤

```bash
# 缺少類型，使用過去式，大寫開頭
Fixed the login bug

# 主題過於模糊
fix user profile

# 結尾有句號
feat: add dark mode.
```
