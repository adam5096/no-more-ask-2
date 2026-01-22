<template>
  <div class="auth-overlay">
    <div class="auth-modal">
      <header class="auth-header">
        <h2 class="auth-title">User Registration</h2>
        <button class="close-btn" @click="handleClose">X</button>
      </header>

      <!-- 成功訊息 -->
      <div v-if="isSuccess" class="success-message">
        <p class="success-text">註冊成功！歡迎加入</p>
        <button class="success-btn" @click="handleClose">確定</button>
      </div>

      <!-- 表單 -->
      <form v-else class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-grid">
          <!-- Email 欄位 -->
          <div class="email-field">
            <label class="email-label">Email</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="user@example.com"
              class="email-input"
              :class="{ 'input-error': errors.email?.length }"
              @blur="validateField('email')"
            />
            <div v-if="errors.email?.length" class="error-message">
              {{ errors.email[0] }}
            </div>
          </div>

          <!-- Password 欄位 -->
          <div class="password-field">
            <label class="password-label">Password</label>
            <input
              v-model="formData.password"
              type="password"
              class="password-input"
              :class="{ 'input-error': errors.password?.length }"
              @blur="validateField('password')"
            />
            <div v-if="errors.password?.length" class="error-message">
              {{ errors.password[0] }}
            </div>
          </div>

          <!-- First Name 和 Last Name 欄位 -->
          <div class="name-row">
            <div class="firstname-field">
              <label class="firstname-label">First Name</label>
              <input
                v-model="formData.firstName"
                type="text"
                class="firstname-input"
                :class="{ 'input-error': errors.firstName?.length }"
                @blur="validateField('firstName')"
              />
              <div v-if="errors.firstName?.length" class="error-message">
                {{ errors.firstName[0] }}
              </div>
            </div>
            <div class="lastname-field">
              <label class="lastname-label">Last Name</label>
              <input
                v-model="formData.lastName"
                type="text"
                class="lastname-input"
                :class="{ 'input-error': errors.lastName?.length }"
                @blur="validateField('lastName')"
              />
              <div v-if="errors.lastName?.length" class="error-message">
                {{ errors.lastName[0] }}
              </div>
            </div>
          </div>

          <!-- Display Name 欄位 -->
          <div class="displayname-field">
            <label class="displayname-label">Display Name</label>
            <input
              v-model="formData.displayName"
              type="text"
              class="displayname-input"
              :class="{ 'input-error': errors.displayName?.length }"
              @blur="validateField('displayName')"
            />
            <div v-if="errors.displayName?.length" class="error-message">
              {{ errors.displayName[0] }}
            </div>
          </div>
        </div>

        <div class="form-footer">
          <button
            type="submit"
            class="register-submit"
            :disabled="isSubmitting"
            :class="{ 'submitting': isSubmitting }"
          >
            {{ isSubmitting ? '註冊中...' : 'Submit Registration' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 明確導入 useAuth（解決 TypeScript 自動導入識別問題）
import { useAuth } from '~/composables/useAuth'

// 型別定義
interface RegisterDTO {
  email: string
  password: string
  firstName: string
  lastName: string
  displayName: string
}

interface RegisterResponse {
  token: string
  email: string
  userId: string
}

interface FieldErrors {
  email?: string[]
  password?: string[]
  firstName?: string[]
  lastName?: string[]
  displayName?: string[]
}

// Emits
const emit = defineEmits<{
  close: []
}>()

// 認證邏輯
const auth = useAuth()

// 表單狀態管理
const formData = ref<RegisterDTO>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  displayName: ''
})

const errors = ref<FieldErrors>({})
const isSubmitting = ref(false)
const isSuccess = ref(false)

// 失焦驗證邏輯
const validateField = (fieldName: keyof RegisterDTO) => {
  const value = formData.value[fieldName]?.trim() || ''
  const fieldErrors: string[] = []

  switch (fieldName) {
    case 'email':
      if (!value) {
        fieldErrors.push('Email 為必填欄位')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.push('請輸入有效的 Email 格式')
      } else if (value.length < 1) {
        fieldErrors.push('Email 長度至少為 1 個字元')
      }
      break

    case 'password':
      if (!value) {
        fieldErrors.push('密碼為必填欄位')
      } else {
        if (value.length < 6) {
          fieldErrors.push('密碼長度至少為 6 個字元')
        }
        // 檢查是否包含特殊字元、大寫字母、小寫字母
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
        const hasUpperCase = /[A-Z]/.test(value)
        const hasLowerCase = /[a-z]/.test(value)
        
        if (!hasSpecialChar || !hasUpperCase || !hasLowerCase) {
          fieldErrors.push('密碼須包含一個以上如下字元：特殊字元、英文字母大、小寫')
        }
      }
      break

    case 'firstName':
      if (!value) {
        fieldErrors.push('First Name 為必填欄位')
      } else if (value.length < 1) {
        fieldErrors.push('First Name 長度至少為 1 個字元')
      }
      break

    case 'lastName':
      if (!value) {
        fieldErrors.push('Last Name 為必填欄位')
      } else if (value.length < 1) {
        fieldErrors.push('Last Name 長度至少為 1 個字元')
      }
      break

    case 'displayName':
      // displayName 為選填，不需要驗證
      break
  }

  // 更新錯誤狀態
  if (fieldErrors.length > 0) {
    errors.value[fieldName] = fieldErrors
  } else {
    delete errors.value[fieldName]
  }
}

// 表單提交處理
const handleSubmit = async () => {
  // 清除之前的錯誤
  errors.value = {}

  // 驗證所有欄位
  validateField('email')
  validateField('password')
  validateField('firstName')
  validateField('lastName')

  // 如果有錯誤，不提交
  if (Object.keys(errors.value).length > 0) {
    return
  }

  // 設定狀態鎖
  isSubmitting.value = true

  try {
    // 呼叫 BFF API
    const response = await $fetch<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: {
        email: formData.value.email.trim(),
        password: formData.value.password,
        firstName: formData.value.firstName.trim(),
        lastName: formData.value.lastName.trim(),
        displayName: formData.value.displayName.trim() || null
      }
    })

    // 儲存認證資訊
    auth.register(response.token, {
      email: response.email,
      userId: response.userId
    })

    // 顯示成功狀態
    isSuccess.value = true

    // 延遲關閉 overlay（3 秒後自動關閉）
    setTimeout(() => {
      handleClose()
    }, 3000)
  } catch (error: any) {
    // 處理錯誤回應
    if (error.data?.errors) {
      // 欄位級別錯誤
      errors.value = error.data.errors as FieldErrors
    } else {
      // 一般錯誤
      console.error('註冊失敗:', error)
      // 可以顯示一般錯誤訊息（例如 Toast）
    }
  } finally {
    // 解除狀態鎖
    isSubmitting.value = false
  }
}

// 關閉 overlay
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
  @apply flex justify-between items-center border-b-4 border-gray-900 px-6 py-4;
}

.auth-title {
  @apply font-black uppercase tracking-tight;
  font-size: clamp(1.5rem, 3vw + 1.2rem, 2.2rem);
}

.close-btn {
  @apply text-3xl font-bold hover:scale-110 active:scale-90 transition-transform;
}

.auth-form {
  @apply p-8 flex flex-col gap-6;
}

.form-grid {
  @apply flex flex-col gap-5;
}

.name-row {
  @apply flex flex-col sm:flex-row gap-5;
}

/* Base input style */
.email-input,
.password-input,
.firstname-input,
.lastname-input,
.displayname-input {
  @apply border-2 border-gray-300 px-4 py-2 font-medium w-full;
  @apply transition-all duration-200;
  @apply focus:border-gray-900 focus:outline-none;
  font-size: clamp(0.9rem, 1vw + 0.8rem, 1.1rem);
}

/* 錯誤狀態的 input */
.input-error {
  @apply border-red-500;
}

/* Base label style */
.email-label,
.password-label,
.firstname-label,
.lastname-label,
.displayname-label {
  @apply font-bold text-sm uppercase tracking-wider text-gray-700;
}

/* Base field style */
.email-field,
.password-field,
.firstname-field,
.lastname-field,
.displayname-field {
  @apply flex flex-col gap-2 min-w-0;
}

.firstname-field,
.lastname-field {
  @apply flex-grow;
}

/* 錯誤訊息樣式 */
.error-message {
  @apply text-red-500 text-sm font-medium;
  @apply mt-1;
}

.form-footer {
  @apply border-t-2 border-gray-200 pt-6;
}

.register-submit {
  @apply w-full bg-gray-900 text-white font-black py-4 uppercase tracking-widest;
  @apply transition-all duration-200;
  @apply hover:bg-gray-800 active:scale-95;
  font-size: clamp(1rem, 1.5vw + 0.9rem, 1.3rem);
}

.register-submit:disabled {
  @apply opacity-50 cursor-not-allowed;
  @apply hover:bg-gray-900;
}

.register-submit.submitting {
  @apply bg-gray-600;
}

/* 成功訊息樣式 */
.success-message {
  @apply p-8 flex flex-col items-center gap-4;
}

.success-text {
  @apply text-green-600 font-bold text-lg;
  @apply text-center;
}

.success-btn {
  @apply bg-gray-900 text-white font-bold px-6 py-2 uppercase tracking-wider;
  @apply transition-all duration-200;
  @apply hover:bg-gray-800 active:scale-95;
}
</style>
