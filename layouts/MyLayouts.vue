<script setup>
import AppHeader from '~/components/layouts/AppHeader.vue'
import AppFooter from '~/components/layouts/AppFooter.vue'
</script>

<template>
    <div class="my-layouts-container">
        <AppHeader />
        <main>
            <slot />
        </main>
        <AppFooter  />
    </div>
</template>


<style scoped>
.my-layouts-container {
    @apply grid grid-rows-[auto_1fr_auto];
    @apply min-h-screen;
    @apply text-6xl font-extrabold;
}
</style>