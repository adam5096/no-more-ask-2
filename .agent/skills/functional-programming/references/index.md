# 編程範式與設計原則

版本：v1.0
建立日期：2025
目的：定義本專案適用的編程範式與設計原則，指導開發實作

---

## 文檔概述

本文檔定義了節慶互助平台（ORCA）專案適用的編程範式與設計原則。這些原則旨在：

- 建立一致的程式碼風格與架構模式
- 提供清晰的設計決策指導
- 平衡開發效率與程式碼品質
- 符合 MVP 階段的快速迭代需求

### 目標讀者

- 前端工程師：實作 Vue 3 / Nuxt 3 組件與 Composables
- 後端工程師：設計 API 與資料結構
- 技術負責人：進行 Code Review 與架構決策

### 技術棧背景

本專案使用以下技術棧：
- 前端框架：Nuxt 3 + Vue 3
- 程式語言：TypeScript
- 開發範式：函數式編程優先

---

## 原則層級結構

本專案的原則分為兩個層級：

```
第一層：設計範式（主要原則）
├── 函數式編程
│   ├── 純函數（Pure Functions）
│   ├── 不可變性（Immutability）
│   ├── 函數組合（Function Composition）
│   └── 高階函數（Higher-Order Functions）

第二層：設計指導（輔助原則）
├── SOLID 的函數式對應
│   ├── 單一職責（Single Responsibility）
│   ├── 依賴反轉（Dependency Inversion）
│   └── 介面隔離（Interface Segregation）
│
└── KISS 原則
    └── Keep It Simple, Stupid
```

### 原則應用方式

主要原則與輔助原則應該同時應用，而非先後順序：

- 主要原則：決定整體風格（函數式編程）
- 輔助原則：幫助優化設計（單一職責、依賴反轉等）

當原則衝突時：
- 主要原則優先（保持函數式風格）
- 但盡量不違反輔助原則
- 如果必須違反，記錄原因並設定重構時間點

---

## 文檔結構

本文檔採用「摘要+引用」風格，主文件提供概述與導航，詳細內容請參考各子文件。

### 01-functional-programming.md

主要原則：函數式編程

包含內容：
- 函數式編程概述與核心概念
- 純函數（Pure Functions）詳述
- 不可變性（Immutability）詳述
- 函數組合（Function Composition）詳述
- 高階函數（Higher-Order Functions）詳述
- 每個原則的定義、範例、最佳實踐、常見錯誤

快速摘要：
函數式編程是本專案的主要設計範式。我們優先使用函數而非類別，透過純函數、不可變性和函數組合來構建應用程式。這符合 Vue 3 Composition API 和 Nuxt 3 的設計理念。

詳細內容請參考：[01-functional-programming.md](./01-functional-programming.md)

### 02-design-principles.md

輔助原則：SOLID 的函數式對應與 KISS 原則

包含內容：
- SOLID 原則在函數式編程中的對應
- 單一職責（Single Responsibility）詳述
- 依賴反轉（Dependency Inversion）詳述
- 介面隔離（Interface Segregation）詳述
- KISS 原則詳述
- 原則之間的關係與協同作用

快速摘要：
雖然 SOLID 原則主要針對物件導向編程，但其核心概念在函數式編程中也有對應。我們透過函數的單一職責、依賴注入和模組導出來達成類似的設計目標。同時，KISS 原則幫助我們避免過度設計，特別是在 MVP 階段。

詳細內容請參考：[02-design-principles.md](./02-design-principles.md)

### 03-practical-applications.md

實際應用案例與原則衝突處理

包含內容：
- Composables 設計模式
- 實際應用案例（註明為參考模型）
- 原則衝突處理機制
- 決策流程圖
- Code Review 檢查清單

快速摘要：
本文件提供實際的應用案例和設計模式，幫助開發者在實作時應用這些原則。所有範例都註明為參考模型，實際實作應根據真實工程需求調整。同時提供原則衝突時的處理機制和決策流程。

詳細內容請參考：[03-practical-applications.md](./03-practical-applications.md)

### 04-side-effect-strategies.md

副作用處理策略

包含內容：
- 副作用處理策略（6 種策略詳述）
- 分層架構：純函數層、副作用邊界層、副作用封裝層
- 策略選擇指南

快速摘要：
在真實開發中，由於業務邏輯的複雜性，幾乎不可能實現 100% 的純函數。本文檔提供 6 種實用的副作用處理策略，幫助開發者在保持函數式編程風格的同時，妥善處理不可避免的副作用。強調不追求 100% 純函數，而是分層處理、漸進式改進、明確標記。

詳細內容請參考：[04-side-effect-strategies.md](./04-side-effect-strategies.md)

### 05-side-effect-practices.md

副作用實務處理

包含內容：
- 實務處理流程：從識別到處理的完整流程
- 檢查清單與決策樹
- 實務案例

快速摘要：
本文檔提供副作用處理的實務流程與案例，包括完整的處理流程圖、實作檢查清單、Code Review 檢查清單，以及實際應用案例。所有範例都註明為參考模型，實際實作應根據真實工程需求調整。

詳細內容請參考：[05-side-effect-practices.md](./05-side-effect-practices.md)

---

## 快速導航

### 按需求查找

- 想了解函數式編程的核心概念？
  → 閱讀 [01-functional-programming.md](./01-functional-programming.md)

- 想知道如何設計 Composables？
  → 閱讀 [02-design-principles.md](./02-design-principles.md) 的單一職責章節
  → 閱讀 [03-practical-applications.md](./03-practical-applications.md) 的 Composables 設計模式

- 遇到原則衝突不知道如何處理？
  → 閱讀 [03-practical-applications.md](./03-practical-applications.md) 的原則衝突處理章節

- 進行 Code Review 需要檢查清單？
  → 閱讀 [03-practical-applications.md](./03-practical-applications.md) 的檢查清單章節

- 遇到不可避免的副作用不知道如何處理？
  → 閱讀 [04-side-effect-strategies.md](./04-side-effect-strategies.md) 了解處理策略
  → 閱讀 [05-side-effect-practices.md](./05-side-effect-practices.md) 查看實務流程

### 按角色查找

- 前端工程師（實作組件與 Composables）
  1. [01-functional-programming.md](./01-functional-programming.md) - 了解函數式編程基礎
  2. [02-design-principles.md](./02-design-principles.md) - 了解設計原則
  3. [04-side-effect-strategies.md](./04-side-effect-strategies.md) - 了解副作用處理策略
  4. [05-side-effect-practices.md](./05-side-effect-practices.md) - 了解副作用實務處理
  5. [03-practical-applications.md](./03-practical-applications.md) - 查看實際案例

- 技術負責人（Code Review 與架構決策）
  1. [index.md](./index.md) - 了解整體原則結構
  2. [04-side-effect-strategies.md](./04-side-effect-strategies.md) - 了解副作用處理策略
  3. [05-side-effect-practices.md](./05-side-effect-practices.md) - 使用檢查清單進行 Review
  4. [03-practical-applications.md](./03-practical-applications.md) - 查看實際案例

---

## 與其他文檔的關係

### 相關文檔

- MVP 決策記錄：[mvp-decisions.md](../../../workflows/prd/method-prototype/mvp-decisions.md)
  - 本原則文檔對齊 MVP 決策原則：「優先選擇施工難度較低的方案」

- 產品需求規格：[prd-v1.md](../../../workflows/prd/method-prototype/prd-v1.md)
  - 本原則文檔指導技術規格的實作方式

---

## 版本歷史

| 版本 | 日期 | 修改內容 | 修改者 |
|------|------|---------|--------|
| v1.0 | 2025 | 初始版本建立 | - |

---

## 維護說明

本文檔應隨著專案發展持續更新：

- 當發現新的設計模式時，更新應用案例
- 當原則衝突時，記錄處理方式並更新衝突處理機制
- 當技術棧變更時，調整原則的實作方式

---

文檔版本：v1.0
最後更新：2025
維護者：待指定

