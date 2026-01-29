<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <!-- 全域錯誤訊息 -->
    <div v-if="externalErrors?.message" class="general-error">
      {{ externalErrors.message[0] }}
    </div>
    <div class="form-grid">
      <!-- Email 欄位 -->
      <div class="form-field">
        <label class="form-label">Email</label>
        <input
          v-model="formData.email"
          type="email"
          placeholder="user@example.com"
          class="form-input email-input"
          :class="{ 'input-error': errors.email?.length }"
          :disabled="isLoading"
          @blur="validateField('email')"
        />
        <div v-if="errors.email?.length" class="error-message">
          {{ errors.email[0] }}
        </div>
      </div>

      <!-- Password 欄位 -->
      <div class="form-field">
        <label class="form-label">Password</label>
        <input
          v-model="formData.password"
          type="password"
          class="form-input password-input"
          :class="{ 'input-error': errors.password?.length }"
          :disabled="isLoading"
          @blur="validateField('password')"
        />
        <div v-if="errors.password?.length" class="error-message">
          {{ errors.password[0] }}
        </div>
      </div>
    </div>

    <div class="form-footer">
      <button
        type="submit"
        class="auth-submit"
        :disabled="isLoading"
        :class="{ 'submitting': isLoading }"
      >
        {{ isLoading ? '登入中...' : '登入' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
// 型別定義
interface LoginDTO {
  email: string
  password: string
}

interface FieldErrors {
  email?: string[]
  password?: string[]
  message?: string[]
}

const props = defineProps<{
  isLoading: boolean
  externalErrors?: FieldErrors
}>()

const emit = defineEmits<{
  submit: [data: LoginDTO]
}>()

// 表單狀態
const formData = ref<LoginDTO>({
  email: '',
  password: ''
})

const errors = ref<FieldErrors>({})

// 監聽外部錯誤（例如 API 回傳的錯誤）
watch(() => props.externalErrors, (newErrors) => {
  if (newErrors) {
    errors.value = { ...newErrors }
  }
}, { deep: true })

// 失焦驗證邏輯
const validateField = (fieldName: keyof LoginDTO) => {
  const value = formData.value[fieldName]?.trim() || ''
  const fieldErrors: string[] = []

  switch (fieldName) {
    case 'email':
      if (!value) {
        fieldErrors.push('Email 為必填欄位')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.push('請輸入有效的 Email 格式')
      }
      break

    case 'password':
      if (!value) {
        fieldErrors.push('密碼為必填欄位')
      } else if (value.length < 6) {
        fieldErrors.push('密碼長度至少為 6 個字元')
      }
      break
  }

  // 更新錯誤狀態
  if (fieldErrors.length > 0) {
    errors.value[fieldName] = fieldErrors
  } else {
    delete errors.value[fieldName]
  }
}

// 提交處理
const handleSubmit = () => {
  // 全域驗證
  validateField('email')
  validateField('password')

  if (Object.keys(errors.value).length === 0) {
    emit('submit', { ...formData.value })
  }
}
</script>

<style scoped>
.auth-form {
  @apply flex flex-col gap-6;
}

.form-grid {
  @apply flex flex-col gap-5;
}

.form-field {
  @apply flex flex-col gap-2;
}

.form-label {
  @apply font-bold text-sm uppercase tracking-wider text-gray-700;
}

.form-input {
  @apply border-2 border-gray-300 px-4 py-2 font-medium w-full;
  @apply transition-all duration-200;
  @apply focus:border-gray-900 focus:outline-none;
  font-size: clamp(0.9rem, 1vw + 0.8rem, 1.1rem);
}

.input-error {
  @apply border-red-500;
}

.error-message {
  @apply text-red-500 text-sm font-medium mt-1;
}

.general-error {
  @apply bg-red-50 border-2 border-red-500 p-3 text-red-600 font-bold text-sm;
}

.form-footer {
  @apply border-t-2 border-gray-200 pt-6;
}

.auth-submit {
  @apply w-full bg-gray-900 text-white font-black py-4 uppercase tracking-widest;
  @apply transition-all duration-200;
  @apply hover:bg-gray-800 active:scale-95;
  font-size: clamp(1rem, 1.5vw + 0.9rem, 1.3rem);
}

.auth-submit:disabled {
  @apply opacity-50 cursor-not-allowed;
  @apply hover:bg-gray-900;
}

.auth-submit.submitting {
  @apply bg-gray-600;
}
</style>
