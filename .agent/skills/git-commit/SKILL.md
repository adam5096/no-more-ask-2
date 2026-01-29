---
name: git-commit
description: 根據 Conventional Commits 規範生成 Git commit message
---

# Git Commit Message Skill

根據「約定式提交 (Conventional Commits)」規範，生成標準化的 commit message。

## 使用方式

```
請使用 git-commit skill 幫我寫 commit message
```

或直接說明改動內容：
```
請根據這次的改動幫我寫 commit message
```

## 輸出格式

```
<類型>[可選的範圍]: <主題描述>

[可選的正文]

[可選的頁腳]
```

## 類型參考

詳見 [commit-format.md](./references/commit-format.md)

| 類型 | 說明 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修復 Bug |
| `docs` | 文件修改 |
| `style` | 格式調整（不影響邏輯）|
| `refactor` | 重構 |
| `perf` | 效能優化 |
| `test` | 測試相關 |
| `build` | 建構系統 |
| `ci` | CI/CD 設定 |
| `chore` | 雜項事務 |

## 主題規範

- 使用**祈使句**（如：add, fix, update）
- 開頭不大寫
- 結尾不加句號
- 使用台灣繁體中文
- 提供剪貼簿，讓我一鍵複製你生成的 message

## 範例

```bash
# 簡單
feat: 新增使用者頭像上傳功能

# 完整
fix(api): 修正使用者資料驗證邏輯

先前的驗證邏輯過於寬鬆，允許無效的 email 格式註冊，
導致下游處理問題。

Closes: #245
```
