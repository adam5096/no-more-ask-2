這兩份文件延續了我們先前的架構，分別針對**副作用自動化**與**強健的流程控制**進行規範。你可以將它們作為進階篇加入你的開發文檔中。

---

# 文件一：`02-State-Persistence-with-WatchEffect.md`

## 1. 核心哲學 (Philosophy)

利用 Vue 3 的副效應偵測機制，達成**狀態與持久化的自動同步**。在 FP 模式下，由於我們永遠「替換整個狀態快照」，`watchEffect` 能精準捕捉到每一次業務邏輯的結束點。

## 2. 實作指南 (Implementation)

* **自動同步**：無需在每個 Action（增刪改）後手動呼叫儲存。
* **單一來源**：確保 LocalStorage 的內容永遠與記憶體中的 `shallowRef` 一致。

### 程式碼範例 (基於 TodoList)

```javascript
import { shallowRef, watchEffect } from 'vue';
import { todoOps } from './todoOps';

export function usePersistentTodo() {
  const STORAGE_KEY = 'fp_todo_list';

  // 1. 初始化：嘗試恢復快照
  const savedData = localStorage.getItem(STORAGE_KEY);
  const todos = shallowRef(savedData ? JSON.parse(savedData) : []);

  // 2. 自動監控：只要 todos.value 發生「引用替換」，就自動執行寫入
  // 這是 FP 不可變動特性帶來的天然優勢
  watchEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
    console.log('✅ 快照已自動持久化');
  });

  // UI Action
  const handleAdd = (text) => {
    // 這裡只需專注於數據變換，不需要管 LocalStorage
    todos.value = todoOps.add(todos.value, { id: Date.now(), text });
  };

  return { todos, handleAdd };
}

```

## 3. 關鍵決策與優點

* **為什麼最佳？**：傳統寫法常在 `add()` 裡寫一次 `save()`，在 `remove()` 裡又寫一次。使用 `watchEffect` 達成了邏輯上的「解耦」。
* **限制**：如果儲存動作非常昂貴（如寫入大型檔案），需考慮配合 `onInvalidate` 進行防抖（Debounce）處理。