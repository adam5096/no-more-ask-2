<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <!-- 全域錯誤訊息 -->
    <div v-if="externalErrors?.message || errors.message" class="general-error">
      {{ (externalErrors?.message || errors.message)?.[0] }}
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
        />
        
        <!-- 密碼強度標籤雲 (Real-time) -->
        <div class="password-criteria-cloud">
          <div 
            v-for="(isValid, key) in passwordCriteria" 
            :key="key"
            class="criteria-pill"
            :class="{ 'is-valid': isValid }"
          >
            {{ criteriaLabels[key] }}
          </div>
        </div>
      </div>

      <!-- First Name 和 Last Name 欄位 -->

      <div class="name-row">
        <div class="form-field flex-grow">
          <label class="form-label">First Name</label>
          <input
            v-model="formData.firstName"
            type="text"
            class="form-input firstname-input"
            :class="{ 'input-error': errors.firstName?.length }"
            :disabled="isLoading"
            @blur="validateField('firstName')"
          />
          <div v-if="errors.firstName?.length" class="error-message">
            {{ errors.firstName[0] }}
          </div>
        </div>
        <div class="form-field flex-grow">
          <label class="form-label">Last Name</label>
          <input
            v-model="formData.lastName"
            type="text"
            class="form-input lastname-input"
            :class="{ 'input-error': errors.lastName?.length }"
            :disabled="isLoading"
            @blur="validateField('lastName')"
          />
          <div v-if="errors.lastName?.length" class="error-message">
            {{ errors.lastName[0] }}
          </div>
        </div>
      </div>

      <!-- Display Name 欄位 -->
      <div class="form-field">
        <label class="form-label">Display Name</label>
        <input
          v-model="formData.displayName"
          type="text"
          class="form-input displayname-input"
          :class="{ 'input-error': errors.displayName?.length }"
          :disabled="isLoading"
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
        class="auth-submit"
        :disabled="isLoading"
        :class="{ 'submitting': isLoading }"
      >
        {{ isLoading ? '註冊中...' : 'Submit Registration' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
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
const criteriaLabels: Record<string, string> = {
  length: '長度 ≥ 6',
  special: '含特殊字元',
  upper: '含大寫字母',
  lower: '含小寫字母'
}

const passwordCriteria = computed(() => {
  const pwd = formData.value.password
  return {
    length: pwd.length >= 6,
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd)
  }
})

const isPasswordValid = computed(() => {
  return Object.values(passwordCriteria.value).every(v => v)
})

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

/* 密碼標籤雲樣式 */
.password-criteria-cloud {
  @apply flex flex-wrap gap-2 mt-3;
}

.criteria-pill {
  @apply px-3 py-1 text-xs font-black uppercase tracking-wider;
  @apply border-2 border-gray-900 bg-white text-gray-400;
  @apply transition-all duration-300 ease-in-out;
  @apply rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)];
}

.criteria-pill.is-valid {
  @apply bg-green-400 text-gray-900 border-gray-900;
  @apply rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)];
  @apply translate-x-[1px] translate-y-[1px] shadow-none;
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
