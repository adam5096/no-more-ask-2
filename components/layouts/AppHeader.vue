<script setup lang="ts">
import AuthOverlay from '~/components/auth/AuthOverlay.vue'
import { useAuth } from '~/composables/useAuth'

const showLogin = ref(false)
const authMode = ref<'login' | 'register'>('login')
const isLoggingOut = ref(false)
const { isAuthenticated, user, logout } = useAuth()

const toggleLogin = (mode: 'login' | 'register' = 'login') => {
  authMode.value = mode
  showLogin.value = !showLogin.value
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await logout()
  } catch (error) {
    console.error('登出失敗:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <header class="header-shell">
    <h1 class="logo-title">My Application</h1>
    <nav class="nav-area">
      <!-- 未登入狀態：顯示 Login 按鈕 -->
      <button v-if="!isAuthenticated" class="login-btn" @click="toggleLogin('login')">
        {{ showLogin ? '關閉' : '登入' }}
      </button>
      
      <!-- 已登入狀態：顯示使用者 email + Logout 按鈕 -->
      <div v-else class="user-section">
        <span class="user-email">{{ user?.email }}</span>
        <button 
          class="logout-btn" 
          :disabled="isLoggingOut"
          :class="{ 'submitting': isLoggingOut }"
          @click="handleLogout"
        >
          {{ isLoggingOut ? '登出中...' : '登出' }}
        </button>
      </div>
    </nav>
    
    <!-- Login Overlay -->
    <Teleport to="body">
      <AuthOverlay 
        v-if="showLogin" 
        :initial-mode="authMode"
        @close="showLogin = false" 
      />
    </Teleport>
  </header>
</template>

<style scoped>
.header-shell {
  @apply bg-white border-b-4 border-gray-900;
  @apply px-4 py-3 flex justify-between items-center;
  @apply relative z-50;
}

.logo-title {
  @apply font-black tracking-tight uppercase;
  font-size: clamp(1.2rem, 2vw + 1rem, 1.8rem);
}

.nav-area {
  @apply flex items-center gap-4;
}

.user-section {
  @apply flex items-center gap-3;
}

.user-email {
  @apply text-sm font-medium text-gray-700;
}

.login-btn,
.logout-btn {
  @apply border-2 border-gray-900 px-4 py-1 font-bold;
}

.logout-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.logout-btn.submitting {
  @apply bg-gray-600 text-white;
}
</style>