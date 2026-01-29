<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <!-- 全域錯誤訊息 -->
    <div v-if="externalErrors?.message || errors.message" class="general-error">
      {{ (externalErrors?.message || errors.message)?.[0] }}
    </div>
    
    <div class="form-grid">
      <!-- Email 欄位 -->
      <AuthInput
        v-model="formData.email"
        id="email"
        label="Email"
        type="email"
        placeholder="user@example.com"
        input-class="email-input"
        :disabled="isLoading"
        :errors="errors.email"
        @blur="validateField('email')"
      />

      <!-- Password 欄位 -->
      <AuthInput
        v-model="formData.password"
        id="password"
        label="Password"
        type="password"
        input-class="password-input"
        :disabled="isLoading"
        :errors="errors.password"
      >
        <template #footer>
          <PasswordCriteriaCloud :criteria-state="passwordCriteria" />
        </template>
      </AuthInput>

      <div class="name-row">
        <AuthInput
          v-model="formData.firstName"
          id="firstName"
          label="First Name"
          input-class="firstname-input"
          class="flex-grow"
          :disabled="isLoading"
          :errors="errors.firstName"
          @blur="validateField('firstName')"
        />
        <AuthInput
          v-model="formData.lastName"
          id="lastName"
          label="Last Name"
          input-class="lastname-input"
          class="flex-grow"
          :disabled="isLoading"
          :errors="errors.lastName"
          @blur="validateField('lastName')"
        />
      </div>

      <!-- Display Name 欄位 -->
      <AuthInput
        v-model="formData.displayName"
        id="displayName"
        label="Display Name"
        input-class="displayname-input"
        :disabled="isLoading"
        :errors="errors.displayName"
        @blur="validateField('displayName')"
      />
    </div>

    <div class="form-footer">
      <button
        type="submit"
        class="auth-submit"
        :disabled="isLoading"
        :class="{ 'submitting': isLoading }"
      >
        {{ isLoading ? '註冊中...' : '送出表單' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { usePasswordStrength } from '~/composables/usePasswordStrength'
import AuthInput from './AuthInput.vue'
import PasswordCriteriaCloud from './PasswordCriteriaCloud.vue'

// 型別定義
interface RegisterDTO {
  email: string
  password: string
  firstName: string
  lastName: string
  displayName: string
}

interface FieldErrors {
  email?: string[]
  password?: string[]
  firstName?: string[]
  lastName?: string[]
  displayName?: string[]
  message?: string[]
}

const props = defineProps<{
  isLoading: boolean
  externalErrors?: FieldErrors
}>()

const emit = defineEmits<{
  submit: [data: RegisterDTO]
}>()

// 表單狀態
const formData = ref<RegisterDTO>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  displayName: ''
})

const errors = ref<FieldErrors>({})

// 密碼即時驗證邏輯
const { criteria: passwordCriteria, isValid: isPasswordValid } = usePasswordStrength(computed(() => formData.value.password))

// 監聽外部錯誤

// 監聽外部錯誤
watch(() => props.externalErrors, (newErrors) => {
  if (newErrors) {
    errors.value = { ...newErrors }
  }
}, { deep: true })

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
      }
      break

    case 'password':
      // 舊有的密碼失焦驗證已由即時驗證取代
      break

    case 'firstName':
      if (!value) fieldErrors.push('First Name 為必填欄位')
      break

    case 'lastName':
      if (!value) fieldErrors.push('Last Name 為必填欄位')
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
  // 清除之前的錯誤
  errors.value = {}
  
  // 全域驗證
  validateField('email')
  validateField('password')
  validateField('firstName')
  validateField('lastName')

  if (Object.keys(errors.value).length === 0 && isPasswordValid.value) {
    emit('submit', { ...formData.value })
  } else if (!isPasswordValid.value) {
    errors.value = { ...errors.value, message: ['請先滿足所有密碼檢查條件'] }
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

.name-row {
  @apply flex flex-col sm:flex-row gap-5;
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
