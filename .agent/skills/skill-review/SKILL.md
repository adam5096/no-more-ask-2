---
name: skill-review
description: 驗收既有與未來新增的 skill 是否遵循「中立性」、「單一職責」與「接力規範」
---

# Skill Review Skill

本技能用於審核 `.agent/skills/` 目錄下的技能品質，確保其具備高度的可複用性與明確的職責分工。

## 參考範本

*   [官方 Skill Creator 範本](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
*   [Antigravity Skill 官方文件](https://antigravity.google/docs/skills?hl=zh-tw)

## 審核原則

在進行 Skill Review 時，必須檢查以下維度：

### 1. 說明清晰度 (Description Clarity)
*   `description` 欄位是否足夠完整且足夠精確地描述了該技能的功能？
*   使用者是否能一眼看出該技能的用途？且不會與其他技能重疊、衝突？

### 2. 職責中立化 (Neutrality)
*   **跨專案複用**：技能是否紀錄了可以跨專案使用的邏輯？
*   **解耦**：技能是否避免了限縮在當前專案的特殊規格？
*   *備註：若有專案專屬規格，應另外開立專屬技能，而非混入通用技能中。*

### 3. 職責明確性 (Singularity / Focus)
*   **單一任務**：一個技能是否只專注於完成一件事？
*   **避免臃腫**：如果技能包含過多不相關的邏輯，應建議拆分。

### 4. 工作流接力 (Workflow Relay)
*   **合理銜接**：技能與 `workflow` 之間是否形成了合理的接力關係？
*   **觸發機制**：技能是否能作為工作流的其中一環，或由工作流觸發？

## 審核流程

1.  讀取目標技能的 `SKILL.md`。
2.  針對上述四個原則逐一比對。
3.  判斷該技能是否適合與現有 Workflow 整合。

## 輸出格式

```markdown
## Skill Review 結果：[Skill Name]

### 📊 綜合評分
[通過 / 建議修正 / 拒絕]

### 🔍 細項審查
| 準則 | 狀態 | 評語 |
| :--- | :--- | :--- |
| 說明清晰度 | ✅ / ⚠️ / ❌ | [說明] |
| 職責中立化 | ✅ / ⚠️ / ❌ | [說明] |
| 職責明確性 | ✅ / ⚠️ / ❌ | [說明] |
| 工作流接力 | ✅ / ⚠️ / ❌ | [說明] |

### 💡 改進建議
*   [具體建議 1]
*   [具體建議 2]

### 🔄 工作流建議
*   建議可以與 `[Workflow Name]` 進行接力，處理 [具體情境]。
```
