---
name: usage-analytics
description: 負責追蹤與記錄 Agent 工具（Skill/Workflow）的使用頻率與健康度。
---

# Usage Analytics Skill

本技能用於維護 `doc/analytics/usage-stats.md`，確保所有開發工具的使用都有跡可循。

## 使用規則

1. **觸發時機**：每次讀取 `.agent/skills` 下的檔案或完成 `.agent/workflows` 中的一個主要步驟後。
2. **操作行為**：
   - 更新 `usage-stats.md` 中的「使用次數」。
   - 更新「最後使用日期」為當前日期。
   - 若發現某工具冗餘或難用，及時在「備註」中記錄建議。
3. **格式規範**：保持表格整齊，並按照次數由高到低進行動態排序（可定期執行）。

## 統計對象
- **Skills**: 在 `.agent/skills/` 目錄下的所有子資料夾。
- **Workflows**: 在 `.agent/workflows/` 目錄下的所有 `.md` 檔案。
