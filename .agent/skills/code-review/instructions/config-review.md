---
description: 配置治理 (Config Governance) 審查規範
---

# Config Governance Review Instructions (nuxt.config.ts)

針對 `nuxt.config.ts` 的配置進行安全性與維護性審查。

## 1. runtimeConfig 安全規範
- **秘密管理**：
    - 凡是涉及 Token、內部 Base URL、私鑰的配置，必須放在 `runtimeConfig` 外層（Server-only）。
    - 只有「前端需要知道」的配置（如公開路徑、GA ID）才能放入 `runtimeConfig.public`。
- **環境變數注入**：
    - 優先使用 `process.env` 或 `.env` 注入，避免在 config 中寫死敏感資訊。

## 2. 模組與插件規範
- **依賴極小化**：新增 Nuxt Module 前必須審查其必要性。
- **配置一致性**：ESLint、PostCSS 等配置應與專案 `design-principles` 保持一致。

## 3. 判斷準則
| 情況 | 判定 |
|------|------|
| 在 `public` 中發現內部遠端 URL | ❌ 嚴重安全違規 |
| 敏感資訊寫死在 `nuxt.config.ts` | ❌ 必須修正，改用環境變數 |
| devtools 在正式環境未正確配置 | ⚠️ 建議改進 |
