---
name: api
description: 負責 API 設計治理、BFF 路徑規範與 Payload 優化方針
---

# API Governance Skill

本技能負責統一專案中的 API 設計標準，確保端點（Endpoints）符合 BFF 架構、HATEOAS 原則，並進行有效的 Payload 優化。

## 使用方式

```markdown
請使用 api skill 參考 [指令路徑] 審核或設計 [端點路徑] 的實作
```

## 核心設計原則

### 1. 路由治理 (Routing Governance)
*   確保端點符合專案定義的路徑規範。
*   範本參考：[Routing](./instructions/architecture/routing.md)。

### 2. 資料交換標準 (Data Standards)
*   根據專案架構規範審核回應結構（如 HATEOAS `_links`）。
*   範本參考：[Hypermedia](./instructions/architecture/hypermedia.md)。

### 3. Payload 優化策略 (Payload Strategy)
*   根據需求進行傳輸體積優化。
*   範本參考：[Optimization](./instructions/architecture/optimization.md)。

### 4. 錯誤處理規範 (Error Standards)
*   確保端點錯誤回應格式的一致性。

## 審核與接力

1.  **注入業務上下文**：執行前應讀取 `.agent/skills/api/instructions/[domain]/` 下的業務規則。
2.  **驗收點**：完成後可交由 `code-review` 技能進行 Server 層面的安全性與邏輯審查。

## 參考範本
*   [官方 Skill Creator 範本](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
*   [BFF 路徑設計指南](file:///c:/Users/Predator/Desktop/no-more-ask-2/.agent/workflows/bff-paths.md)
