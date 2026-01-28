<script setup>
definePageMeta({
  layout: 'dashboard',
  devOnly: true
})
</script>

<template>
  <section class="dashboard-content">
    <h1 class="content-title">儀表板</h1>
    <p class="content-placeholder">Dashboard Content Placeholder</p>
    <div class="content-box">
      這是主內容區域，用於驗證 Layout 渲染是否正確。
    </div>
  </section>
</template>

<style scoped>
.dashboard-content {
  @apply flex flex-col gap-4;
}

.content-title {
  @apply text-2xl font-bold;
  @apply border-b border-gray-300 pb-2;
}

.content-placeholder {
  @apply text-gray-500;
}

.content-box {
  @apply p-4;
  @apply border border-gray-300 rounded;
  @apply bg-gray-50;
}
</style>
