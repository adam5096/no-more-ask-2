---
description: HATEOAS 通用架構指南
---

## 1. 核心哲學：資料與行為的物理隔離

在 API 回傳的 JSON 中，我們必須嚴格區分「資源目前的樣子」與「資源接下來能做的動作」。

* **業務資料 (Data)**：如 `task`, `id`。
* **導航元數據 (Metadata)**：放在以底線開頭的 `_links` 物件中，遵循 HAL 標準，避免與業務欄位衝突。

---

## 2. 【後端實作】BFF 狀態機引擎

在 **Nitro (BFF)** 層，我們建立一個「軍火庫」(`server/utils`) 來決定行為的生死。

### 📁 `server/utils/todoLinkBuilder.ts`

> **小白筆記**：這裡就是「大腦」。前端不准自己決定能不能顯示按鈕，由這裡算出來。

```typescript
export interface TodoLink {
  rel: 'self' | 'toggle' | 'update' | 'delete' | 'archive';
  href: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
}

/**
 * 根據狀態生成「行為門票」
 */
export const buildTodoLinks = (id: string, isCompleted: boolean): TodoLink[] => {
  const baseUrl = `/api/todos/${id}`;
  const links: TodoLink[] = [{ rel: 'self', href: baseUrl, method: 'GET' }];

  if (!isCompleted) {
    // 未完成：可以切換成完成、可以修改文字
    links.push({ rel: 'toggle', href: `${baseUrl}/toggle`, method: 'PATCH' });
    links.push({ rel: 'update', href: baseUrl, method: 'PATCH' });
  } else {
    // 已完成：可以取消勾選、可以歸檔
    links.push({ rel: 'toggle', href: `${baseUrl}/toggle`, method: 'PATCH' });
    links.push({ rel: 'archive', href: `${baseUrl}/archive`, method: 'POST' });
  }

  links.push({ rel: 'delete', href: baseUrl, method: 'DELETE' });
  return links;
};

```

### 📁 `server/api/todos/[id].get.ts`

> **小白筆記**：這裡把「死資料」加工成「活連結」。

```typescript
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  // 模擬從資料庫拿到的原始 JSON
  const rawTodo = { id, task: "學會 HATEOAS", completed: false };

  // 注入行為導航
  return {
    ...rawTodo,
    _links: buildTodoLinks(rawTodo.id!, rawTodo.completed)
  };
});

```

---

## 3. 【前端實作】聲明式行為渲染

前端組件變得很「笨」，它不再寫業務邏輯，只負責「看地圖（`_links`）辦事」。

### 📁 `app.vue`

> **小白筆記**：不要寫 `if(todo.completed)`，要寫 `if(getLink('archive'))`。

```vue
<script setup>
const { data: todo, refresh } = await useFetch('/api/todos/1');

// 💡 重點：查詢地圖上有沒有這個動作
const getLink = (rel) => todo.value?._links.find(l => l.rel === rel);

const doAction = async (rel) => {
  const link = getLink(rel);
  if (!link) return;

  await $fetch(link.href, { method: link.method });
  refresh(); // 執行完刷新，後端會給出下一階段的新連結
};
</script>

<template>
  <div v-if="todo" :data-status="todo.completed ? 'done' : 'active'">
    <h3>{{ todo.task }}</h3>

    <button v-if="getLink('update')" @click="doAction('update')">修改</button>

    <button v-if="getLink('toggle')" @click="doAction('toggle')">
      {{ todo.completed ? '復原' : '完成' }}
    </button>
  </div>
</template>

```

---

## 4. 導航層次表 (Navigation Taxonomy)

* **頁面路由導航 (Page Routing)**
* **驅動者**：前端框架 (Nuxt `pages` / `vue-router`)。
* **核心責任**：處理「空間」位移，變更瀏覽器 URL 以切換不同的大型功能模組。
* **負責檔案**：`pages/*.vue`。
* **實戰範例**：從「代辦清單頁」跳轉到「個人設定頁」。


* **UI 交互導航 (UI Navigation)**
* **驅動者**：前端組件內部狀態 (`ref`, `reactive`)。
* **核心責任**：處理「視覺呈現」，在不涉及業務邏輯的情況下，改變介面的交互外觀。
* **負責檔案**：各類 UI Components (`.vue`)。
* **實戰範例**：點擊按鈕展開側邊欄、切換分頁標籤（Tabs）、開啟彈窗（Modal）。


* **行為狀態導航 (Actions Navigate) — HATEOAS 核心**
* **驅動者**：**後端/BFF 狀態機 (`_links`)**。
* **核心責任**：處理「業務生命週期」，決定資源在當前狀態下「被允許」執行的下一步動作。
* **負責檔案**：`server/api/*.ts` 與 `server/utils/*.ts`。
* **實戰範例**：將 Todo 標記為完成、將訂單從「待付款」轉為「已取消」、觸發資料歸檔。


---

## 5. 指南總結：為什麼這對系統至關重要？

1. **邏輯集中化**：未來要改「誰能刪除」、「什麼時候能歸檔」，只要改後端 `utils`，全平台的 App、Web 會同步生效。
2. **物理防呆**：前端不顯示按鈕，不只是隱藏 UI，而是因為「後端根本沒給你這張門票（URL）」。
3. **溝通一致性**：UI/UX 設計師與工程師討論時，優先盤點「行為狀態（Actions）」，這會讓開發過程中的例外狀況（Error Handling）大幅減少。

---

這份合併檔案不僅解釋了 **Why (為什麼要底線、為什麼要解耦)**，更展示了 **How (程式碼怎麼寫)**。