
---

## 🧪 單元測試指南：測試你的 Functional Core

我們使用 **Vitest**（Vue 官方推薦測試工具）作為範例。

### 1. 安裝與環境

確保你的專案已安裝 Vitest。在 `package.json` 中通常會有：

```json
"scripts": {
  "test": "vitest"
}

```

### 2. 撰寫測試檔案 (`todoLogic.test.js`)

測試的原則是：**給予輸入，預期輸出**。

```javascript
import { describe, it, expect } from 'vitest';
import * as logic from './todoLogic';

describe('Todo Logic (Functional Core)', () => {

  // 🔹 測試新增功能
  it('應該能新增一個代辦事項到列表中', () => {
    const initialState = [];
    const newState = logic.addTodo(initialState, '學習 FP');
    
    expect(newState).toHaveLength(1);
    expect(newState[0].text).toBe('學習 FP');
    expect(newState[0].completed).toBe(false);
  });

  // 🔹 測試狀態切換 (不可變性驗證)
  it('應該能切換特定事項的完成狀態，且不影響原始資料', () => {
    const initialState = [{ id: 1, text: '舊任務', completed: false }];
    const newState = logic.toggleTodo(initialState, 1);
    
    expect(newState[0].completed).toBe(true);
    // 關鍵：確保原始資料沒有被改動 (Immutability)
    expect(initialState[0].completed).toBe(false); 
  });

  // 🔹 測試刪除功能
  it('應該能根據 ID 移除事項', () => {
    const initialState = [
      { id: 1, text: '任務 A' },
      { id: 2, text: '任務 B' }
    ];
    const newState = logic.removeTodo(initialState, 1);
    
    expect(newState).toHaveLength(1);
    expect(newState[0].id).toBe(2);
  });

});

```

---

## 💡 給新手的「低摩擦」測試觀念

### A. 測試「邏輯」，而非「框架」

你會發現上面的測試中完全沒有出現 `ref` 或 `<template>`。

* **原因：** 如果你的邏輯（Core）是對的，但畫面錯了，那是 Vue 組件（Shell）的問題。
* **好處：** 當你以後想從 Vue 換成 React，你的 `todoLogic.test.js` 內容**完全不用改**。

### B. 測試「邊界情況」 (Edge Cases)

這是測試最有價值的地方。你可以輕鬆測試一些在 UI 上很難模擬的情況：

```javascript
it('如果輸入空字串，不應該新增任何內容', () => {
  const initialState = [];
  const newState = logic.addTodo(initialState, '   '); // 全空格
  expect(newState).toHaveLength(0);
});

```

### C. 執行測試

在終端機輸入：

```bash
npm test

```