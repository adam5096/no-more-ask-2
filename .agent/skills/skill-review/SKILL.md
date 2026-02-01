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

### 5. 連結性與依賴管理 (Connectivity & Dependency Management)
*   **依賴辨識**：是否清楚指出了該文件的前置需求 (Prerequisites)？例如：需要先閱讀某個 Workflow 或先執行某個 Skill。
*   **下一步指引**：是否清楚指出了該文件的下一步 (Next Steps)？例如：執行完此操作後，應該接續哪個 Workflow 或 Skill。
*   **明確路徑**：若存在這種前後關係，必須在文件中明確標示「上一步」與「下一步」的連結位置。

## 審核流程

1.  讀取目標技能的 `SKILL.md`。
2.  針對上述五個原則逐一比對。
3.  特別檢查是否遺漏了與其他 Workflow/Skill 的依賴關係說明。
4.  判斷該技能是否適合與現有 Workflow 整合。

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
| 連結完整性 | ✅ / ⚠️ / ❌ | [說明：是否缺少 Step 接力指引？] |

### 💡 改進建議
*   [具體建議 1]
*   [具體建議 2]

### 🔄 依賴關係檢測 (Dependency Check)
*   **前置依賴 (Prev Context)**: [檢測到的前一步，若無則標示 N/A]
*   **後續接力 (Next Step)**: [檢測到的下一步，若無則標示 N/A]
*   **優化建議**: [若發現潛在的連接機會，請在此建議。例如：「建議將此 Skill 的下一步指向 `xxx-workflow`」]
```
