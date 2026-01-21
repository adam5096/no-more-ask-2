<script setup>
import AppHeader from '~/components/layouts/AppHeader.vue'
import AppFooter from '~/components/layouts/AppFooter.vue'
</script>

<template>
  <div class="l-main-layout">
    <AppHeader />
    <main class="l-main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.l-main-layout {
  @apply flex flex-col min-h-screen;
  @apply bg-white text-gray-900;
  /* 動態字體：實現全域無縫縮放 */
  font-size: clamp(1rem, 1.2vw + 0.8rem, 1.25rem);
}

.l-main {
  @apply flex-grow;
  @apply bg-gray-50;
  @apply border-x border-gray-300;
  @apply p-4 sm:p-6 lg:p-10;
  @apply w-full mx-auto container;
}
</style>