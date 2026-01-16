<script setup>
definePageMeta({
    layout: 'my-layouts'
})
</script>

<template>
    <section class="main-container">
        <div class="bg-red-500">LEFT SIDEBAR</div>
        <h1 class="bg-green-500">Hello World</h1>
        <div class="bg-blue-500">RIGHT SIDEBAR</div>
    </section>

</template>

<style scoped>
.main-container {
    @apply h-full grid grid-cols-[auto_1fr_auto];
}
</style>