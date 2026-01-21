
---

## 🚀 Vue 3 核心開發指南：Core & Shell 模式

⚠️ 重要聲明 (Important Disclaimer) Todo List 是所有真實軟體任務的「雛形」。在此指南中，它僅作為教學範例與參考材料，並不代表開發實務中只有簡單的代辦事項。

真實開發場景遠比 Todo List 複雜得多（涉及非同步、複雜權限、大數據效能等）。然而，你可以透過此範例，觀察如何結合 Vue 3 的響應式優勢 與 函數式編程範式 (Functional Programming Paradigm) 來進行高效的協力開發與自動化測試。掌握了這套核心模式，你就能應對更龐大的系統架構。

### 1. 目錄結構：鄰近原則 (Colocation)

不要把邏輯丟到遙遠的資料夾。將 UI 和邏輯放在一起，減少切換檔案的腦力消耗。

```text
src/components/Todo/
├── TodoApp.vue       # Imperative Shell (負責看與動)
├── todoLogic.js      # Functional Core (負責算)
└── todoLogic.test.js # (選配) 只有複雜時才寫測試

```

---

### 2. 第一步：撰寫 Functional Core (純 JS)

在 `todoLogic.js` 中，**禁止**出現 `ref`, `reactive` 或任何 Vue API。它只處理「輸入 A，得到 B」。

```javascript
// todoLogic.js - 你的邏輯實驗室

// 🔹 核心 1：新增 (不可變寫法)
export const addTodo = (todos, text) => {
  if (!text.trim()) return todos;
  const newTodo = { id: Date.now(), text, completed: false };
  return [...todos, newTodo]; 
};

// 🔹 核心 2：刪除
export const removeTodo = (todos, id) => {
  return todos.filter(t => t.id !== id);
};

// 🔹 核心 3：切換狀態 (使用你學到的 Spread Operator)
export const toggleTodo = (todos, id) => {
  return todos.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  );
};

```

---

### 3. 第二步：撰寫 Imperative Shell (Vue 組件)

在 `TodoApp.vue` 中，你只需要做三件事：**定義狀態、綁定 UI、呼叫 Core**。

```vue
<script setup>
import { ref } from 'vue';
import * as logic from './todoLogic'; // 引入所有邏輯

// 1. 定義狀態 (Shell 的職責)
const todos = ref([]);
const userInput = ref('');

// 2. 定義動作 (指令：拿資料去給 Core 算，算完更新 Ref)
const onAdd = () => {
  todos.value = logic.addTodo(todos.value, userInput.value);
  userInput.value = ''; // 只有 Shell 可以處理這種「清空 UI」的副作用
};

const onToggle = (id) => {
  todos.value = logic.toggleTodo(todos.value, id);
};

const onRemove = (id) => {
  todos.value = logic.removeTodo(todos.value, id);
};
</script>

<template>
  <div>
    <input v-model="userInput" @keyup.enter="onAdd" />
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <span @click="onToggle(todo.id)">{{ todo.completed ? '✅' : '⬜' }} {{ todo.text }}</span>
        <button @click="onRemove(todo.id)">刪除</button>
      </li>
    </ul>
  </div>
</template>

```

---

### 4. 低摩擦力開發手則 (Cheatsheet)

如果你在開發時感到糾結，請對照這張表：

| 情境 | 該寫在 Core 還是 Shell？ | 判斷標準 |
| --- | --- | --- |
| **陣列操作** (filter, map, push) | **Core** | 這是「資料運算」。 |
| **清空 Input 欄位** | **Shell** | 這是「介面操作」。 |
| **打 API 取資料** | **Shell** | 這是「外部干擾」（副作用）。 |
| **判斷是否符合新增資格** | **Core** | 這是「業務邏輯」。 |
| **彈出 `alert` 視窗** | **Shell** | 這是「瀏覽器行為」。 |

---