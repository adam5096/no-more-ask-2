<script setup lang="ts">
// Dashboard Layout - Wireframe 階段
// 遵循 opening-layout.md 開版規範
</script>

<template>
  <div class="dashboard-container">
    <!-- 隱藏的 Checkbox 控制導航開關 (純 CSS Hack) -->
    <input
      id="nav-toggle"
      type="checkbox"
      class="nav-toggle-input"
    >

    <!-- 頂部欄 -->
    <header class="dashboard-header">
      <label
        for="nav-toggle"
        class="nav-toggle-btn"
      >
        <span class="nav-toggle-icon">☰</span>
      </label>
      <span class="header-title">Dashboard</span>
      <div class="header-spacer" />
    </header>

    <!-- 桌面版側邊欄 -->
    <aside class="dashboard-sidebar">
      <nav class="sidebar-nav">
        <a
          href="/dashboard"
          class="nav-item"
        >儀表板</a>
        <a
          href="/rescue-request"
          class="nav-item"
        >救援請求</a>
        <a
          href="/helper"
          class="nav-item"
        >Helper</a>
        <a
          href="/notifications"
          class="nav-item"
        >通知</a>
      </nav>
    </aside>

    <!-- 移動版全螢幕導航 Modal -->
    <div class="dashboard-nav-modal">
      <label
        for="nav-toggle"
        class="nav-modal-backdrop"
      />
      <nav class="nav-modal-content">
        <label
          for="nav-toggle"
          class="nav-modal-close"
        >✕</label>
        <a
          href="/dashboard"
          class="nav-item"
        >儀表板</a>
        <a
          href="/rescue-request"
          class="nav-item"
        >救援請求</a>
        <a
          href="/helper"
          class="nav-item"
        >Helper</a>
        <a
          href="/notifications"
          class="nav-item"
        >通知</a>
      </nav>
    </div>

    <!-- 主內容區 -->
    <main class="dashboard-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
/* ========================================
   Dashboard Layout - Wireframe Style
   遵循: opening-layout.md, px-em-rem-clamp-usage-guide.md
   斷點: sm(300px), lg(800px), xl(1400px)
   ======================================== */

/* === 隱藏的 Toggle Input === */
.nav-toggle-input {
  @apply hidden;
}

/* === 外層 Grid 容器 === */
.dashboard-container {
  @apply min-h-[100dvh];
  @apply bg-white text-gray-900;
  display: grid;
  grid-template-areas:
    "header"
    "main";
  grid-template-rows: auto 1fr;
}

/* === 頂部欄 === */
.dashboard-header {
  grid-area: header;
  @apply flex items-center gap-4;
  @apply px-4 py-3;
  @apply border-b border-gray-300;
  @apply bg-gray-100;
}

.nav-toggle-btn {
  @apply cursor-pointer;
  @apply p-2;
  @apply border border-gray-400 rounded;
  @apply hover:bg-gray-200;
}

.nav-toggle-icon {
  @apply text-xl;
}

.header-title {
  @apply font-semibold text-lg;
}

.header-spacer {
  @apply flex-grow;
}

/* === 桌面版側邊欄 (預設隱藏) === */
.dashboard-sidebar {
  display: none;
}

.sidebar-nav {
  @apply flex flex-col gap-2 p-4;
}

/* === 移動版全螢幕導航 Modal (預設隱藏) === */
.dashboard-nav-modal {
  @apply fixed inset-0;
  @apply pointer-events-none opacity-0;
  @apply z-50;
  transition: opacity 0.25s ease;
}

.nav-modal-backdrop {
  @apply absolute inset-0;
  @apply bg-black/50;
  @apply cursor-pointer;
  backdrop-filter: blur(4px);
}

.nav-modal-content {
  @apply absolute inset-0;
  @apply flex flex-col items-center justify-center gap-6;
  @apply bg-white;
  @apply p-8;
}

.nav-modal-close {
  @apply absolute top-4 right-4;
  @apply text-2xl cursor-pointer;
  @apply p-2;
  @apply hover:bg-gray-200 rounded;
}

/* === 導航項目共用樣式 === */
.nav-item {
  @apply block;
  @apply px-4 py-3;
  @apply border border-gray-300 rounded;
  @apply text-center;
  @apply hover:bg-gray-300;
  transition: all 0.15s ease;
}

/* === 主內容區 === */
.dashboard-main {
  grid-area: main;
  @apply p-4;
  @apply overflow-auto;
}

/* ========================================
   純 CSS 開關邏輯
   ======================================== */

/* 當 checkbox 被選中時，顯示 Mobile Nav Modal */
.nav-toggle-input:checked ~ .dashboard-nav-modal {
  @apply pointer-events-auto opacity-100;
}

/* 當 Modal 打開時，防止背景滾動 */
.nav-toggle-input:checked ~ .dashboard-main {
  @apply overflow-hidden;
}

/* ========================================
   響應式：Desktop (lg: 800px+)
   ======================================== */

@media (min-width: 800px) {
  .dashboard-container {
    grid-template-areas:
      "header header"
      "sidebar main";
    grid-template-columns: 16rem 1fr;
  }

  /* 隱藏漢堡選單按鈕 */
  .nav-toggle-btn {
    @apply hidden;
  }

  /* 顯示側邊欄 */
  .dashboard-sidebar {
    display: block;
    grid-area: sidebar;
    @apply border-r border-gray-300;
    @apply bg-gray-50;
  }

  /* 完全禁用 Mobile Modal */
  .dashboard-nav-modal {
    @apply hidden;
  }

  /* 調整主內容區間距 */
  .dashboard-main {
    @apply p-6;
  }
}

/* ========================================
   響應式：Extra Large (xl: 1400px+)
   ======================================== */

@media (min-width: 1400px) {
  .dashboard-container {
    grid-template-columns: 18rem 1fr;
  }

  .dashboard-main {
    @apply p-10;
  }
}
</style>
