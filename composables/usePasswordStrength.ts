import { computed, type Ref } from 'vue'

export interface PasswordCriteria {
  length: boolean
  special: boolean
  upper: boolean
  lower: boolean
}

export const criteriaLabels: Record<keyof PasswordCriteria, string> = {
  length: '長度 ≥ 6',
  special: '含特殊字元',
  upper: '含大寫字母',
  lower: '含小寫字母'
}

/**
 * 密碼強度檢查 Composable
 * @param password 密碼的 Ref 或 Computed
 */
export const usePasswordStrength = (password: Ref<string> | ComputedRef<string>) => {
  const criteria = computed<PasswordCriteria>(() => {
    const pwd = password.value
    return {
      length: pwd.length >= 6,
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd)
    }
  })

  const isValid = computed(() => {
    return Object.values(criteria.value).every(v => v)
  })

  return {
    criteria,
    isValid,
    labels: criteriaLabels
  }
}
