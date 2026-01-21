<script setup>
import AuthOverlay from '~/components/auth/AuthOverlay.vue'

const showLogin = ref(false)

const toggleLogin = () => {
  showLogin.value = !showLogin.value
}
</script>

<template>
  <header class="component-header">
    <h1 class="component-title">My Application</h1>
    <nav class="component-nav">
      <button class="component-btn" @click="toggleLogin">
        {{ showLogin ? 'Close' : 'Login' }}
      </button>
    </nav>
    
    <!-- Login Overlay -->
    <Teleport to="body">
      <AuthOverlay v-if="showLogin" @close="showLogin = false" />
    </Teleport>
  </header>
</template>

<style scoped>
.component-header {
  @apply bg-white border-b-4 border-gray-900;
  @apply px-4 py-3 flex justify-between items-center;
  @apply relative z-50;
}

.component-title {
  @apply font-black tracking-tight uppercase;
  font-size: clamp(1.2rem, 2vw + 1rem, 1.8rem);
}

.component-nav {
  @apply flex items-center gap-4;
}

.component-btn {
  @apply border-2 border-gray-900 px-4 py-1 font-bold rounded-none;
  @apply transition-all duration-200;
  @apply hover:rounded-lg active:scale-95;
}
</style>