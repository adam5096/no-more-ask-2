<template>
  <div class="auth-overlay">
    <div class="auth-modal">
      <header class="auth-header">
        <h2 class="auth-title">
          {{ mode === 'login' ? '登入' : '註冊' }}
        </h2>
        <button class="close-btn" @click="handleClose" :disabled="isLoading">X</button>
      </header>

      <!-- 成功訊息 -->
      <div v-if="successMessage" class="success-screen">
        <div class="pixel-icon">✓</div>
        <p class="success-text">{{ successMessage }}</p>
        <button class="success-btn" @click="handleClose">確定</button>
      </div>

      <!-- 表單容器 -->
      <div v-else class="auth-content">
        <!-- 模式切換器 -->
        <div class="mode-switcher">
          <button
            class="switch-btn"
            :class="{ active: mode === 'login' }"
            @click="setMode('login')"
            :disabled="isLoading"
          >
            登入
          </button>
          <button
            class="switch-btn"
            :class="{ active: mode === 'register' }"
            @click="setMode('register')"
            :disabled="isLoading"
          >
            註冊
          </button>
        </div>

        <!-- 登入表單 -->
        <LoginForm
          v-if="mode === 'login'"
          :is-loading="isLoading"
          :external-errors="errors"
          @submit="handleLogin"
        />

        <!-- 註冊表單 -->
        <RegisterForm
          v-else
          :is-loading="isLoading"
          :external-errors="errors"
          @submit="handleRegister"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import { useAuth } from '~/composables/useAuth'
import { toApiError, type FieldErrors } from '~/types/api-error'

const props = defineProps({
  initialMode: {
    type: String as PropType<'login' | 'register'>,
    default: 'login'
  }
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// 認證邏輯
const auth = useAuth()

// 狀態管理
const mode = ref<'login' | 'register'>(props.initialMode)
const isLoading = ref(false)
const successMessage = ref('')
const errors = ref<FieldErrors>({})

// 登入 DTO
interface LoginDTO {
  email: string
  password: string
}

// 註冊 DTO
interface RegisterDTO {
  email: string
  password: string
  firstName: string
  lastName: string
  displayName?: string
}

// 切換模式
const setMode = (newMode: 'login' | 'register') => {
  mode.value = newMode
  errors.value = {}
}

// 登入處理
const handleLogin = async (data: LoginDTO) => {
  isLoading.value = true
  errors.value = {}

  try {
    await auth.login(data)
    successMessage.value = '登入成功！正在跳轉...'

    setTimeout(() => {
      handleClose()
    }, 2000)
  } catch (err: unknown) {
    const error = toApiError(err)
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      console.error('登入失敗:', error)
    }
  } finally {
    isLoading.value = false
  }
}

// 註冊處理
const handleRegister = async (data: RegisterDTO) => {
  isLoading.value = true
  errors.value = {}

  try {
    await auth.register(data)
    successMessage.value = '註冊成功！歡迎加入'

    setTimeout(() => {
      handleClose()
    }, 2000)
  } catch (err: unknown) {
    const error = toApiError(err)
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      console.error('註冊失敗:', error)
    }
  } finally {
    isLoading.value = false
  }
}

// 關閉
const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.auth-overlay {
  @apply fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm;
  @apply min-h-[100dvh];
}

.auth-modal {
  @apply bg-white border-4 border-gray-900 w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)];
  @apply flex flex-col max-h-full overflow-y-auto;
}

.auth-header {
  @apply flex justify-between items-center border-b-4 border-gray-900 px-6 py-4 bg-gray-50;
}

.auth-title {
  @apply font-black uppercase tracking-tight;
  font-size: clamp(1.2rem, 2vw + 1rem, 1.8rem);
}

.close-btn {
  @apply text-2xl font-bold transition-transform;
}

.auth-content {
  @apply p-6 sm:p-8 flex flex-col gap-6;
}

/* 模式切換器樣式 */
.mode-switcher {
  @apply flex border-4 border-gray-900 bg-gray-100;
}

.switch-btn {
  @apply flex-1 py-3 font-black uppercase tracking-widest transition-all duration-200;
  @apply hover:bg-gray-200;
}

.switch-btn.active {
  @apply bg-gray-900 text-white hover:bg-gray-900;
}

.switch-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* 成功畫面樣式 */
.success-screen {
  @apply p-12 flex flex-col items-center gap-6;
}

.pixel-icon {
  @apply w-16 h-16 bg-green-500 border-4 border-gray-900 flex items-center justify-center;
  @apply text-white text-3xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)];
}

.success-text {
  @apply text-green-600 font-bold text-xl text-center;
}

.success-btn {
  @apply bg-gray-900 text-white font-bold px-10 py-3 uppercase tracking-wider;
  @apply transition-all duration-200 hover:bg-gray-800;
  @apply border-2 border-gray-900;
}
</style>
