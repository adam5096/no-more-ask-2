# Agent 技能與工作流使用統計 (Usage Analytics)

本檔案用於追蹤 `.agent/` 目錄下所有 Skill 與 Workflow 的使用頻率，作為定期清理與重構的依據。

**最後統計日期**: 2026-02-03

---

## 🏆 熱門排行榜 (Top 5)

1. `git-commit` (Skill) - 6 次
2. `orca-modeling` (Skill) - 4 次
3. `implementation-lifecycle` (Workflow) - 3 次
4. `acceptance-criteria` (Workflow) - 2 次
5. `discovery-interview` (Workflow) - 2 次

---

## 🛠️ Skills 使用統計

| 名稱 | 使用次數 | 最後使用日期 | 狀態 | 備註 |
| :--- | :---: | :--- | :--- | :--- |
| `git-commit` | 6 | 2026-02-03 | ✅ 常用 | 格式穩定，對傳統提交很有幫助 |
| `orca-modeling` | 4 | 2026-02-03 | ✅ 常用 | 適合初期需求收斂 |
| `code-review` | 2 | 2026-02-02 | 🟡 尚可 | 邏輯較重，適合 Phase 結束前執行 |
| `layout` | 1 | 2026-01-27 | ⏳ 低頻 | 僅在開版時使用 |
| `usage-analytics` | 1 | 2026-02-03 | 🆕 新增 | 定義統計規則與格式 |

---

## 🔄 Workflows 使用統計

| 名稱/路徑 | 使用次數 | 最後使用日期 | 狀態 | 備註 |
| :--- | :---: | :--- | :--- | :--- |
| `implementation-lifecycle` | 4 | 2026-02-03 | ✅ 常用 | 核心開發流程，已整合分析統計步驟 |
| `acceptance-criteria` | 2 | 2026-02-03 | ✅ 常用 | 確保開發不偏離需求 |
| `1-discovery-interview` | 2 | 2026-02-03 | ✅ 常用 | ORCA 的前置步驟 |
| `usage-analytics` | 1 | 2026-02-03 | 🆕 新增 | 用於追蹤 Agent 工具使用狀況 |
| `development-workflow` | 1 | 2026-02-02 | 🟡 尚可 | 高層級指導，不常直接開啟 |
| `prd-v1` | 1 | 2026-02-02 | 🟡 尚可 | 僅在需求大改時參考 |
| `ux-review` | 0 | - | ❌ 未用 | 考慮合併或刪除 |

---

## 🗑️ 建議清理清單

- `ux-review`: 建立至今未使用，功能可能與 `code-review` 重疊。
- `legacy-auth-flow`: 專案架構已翻新，舊有流程圖已失效。

---

## 📝 更新日誌 (Audit Log)
- **2026-02-03**: 初始化統計檔案。將今日「情緒地景」重構過程中使用到的 ORCA 與驗收標準流程計入。
