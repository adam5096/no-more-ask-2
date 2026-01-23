import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import AuthOverlay from './AuthOverlay.vue'

// Mock useAuth composable（保留真實邏輯，但使用 ref 來模擬）
const mockToken = ref<string | null>(null)
const mockUser = ref<{ email: string; userId: string } | null>(null)

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    token: mockToken,
    user: mockUser,
    isAuthenticated: computed(() => !!mockToken.value && !!mockUser.value),
    login: (token: string, userData: { email: string; userId: string }) => {
      mockToken.value = token
      mockUser.value = userData
    },
    register: (userData: { email: string; userId: string }) => {
      mockToken.value = null // 註冊不再直接取得 token
      mockUser.value = userData
    },
    logout: () => {
      mockToken.value = null
      mockUser.value = null
    },
    fetchUser: vi.fn()
  })
}))

// Mock $fetch
const mockFetch = vi.fn()

// 在 Nuxt 3 中，$fetch 是全局可用的
// 我們需要在組件掛載前設置 mock
vi.stubGlobal('$fetch', mockFetch)

describe('AuthOverlay', () => {
  beforeEach(() => {
    // 清除所有 mock 狀態
    vi.clearAllMocks()
    // 重置 $fetch mock
    mockFetch.mockClear()
    // 重置狀態
    mockToken.value = null
    mockUser.value = null
  })

  describe('前端元素', () => {
    it('標題和關閉按鈕應正確顯示', async () => {
      const wrapper = mount(AuthOverlay)
      
      const title = wrapper.find('.auth-title')
      const closeBtn = wrapper.find('.close-btn')
      
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('User Registration')
      expect(closeBtn.exists()).toBe(true)
      expect(closeBtn.text()).toBe('X')
    })

    it('表單欄位應正確渲染', async () => {
      const wrapper = mount(AuthOverlay)
      
      const emailInput = wrapper.find('.email-input')
      const passwordInput = wrapper.find('.password-input')
      const firstNameInput = wrapper.find('.firstname-input')
      const lastNameInput = wrapper.find('.lastname-input')
      const displayNameInput = wrapper.find('.displayname-input')
      
      const emailLabel = wrapper.find('.email-label')
      const passwordLabel = wrapper.find('.password-label')
      const firstNameLabel = wrapper.find('.firstname-label')
      const lastNameLabel = wrapper.find('.lastname-label')
      const displayNameLabel = wrapper.find('.displayname-label')
      
      expect(emailInput.exists()).toBe(true)
      expect(passwordInput.exists()).toBe(true)
      expect(firstNameInput.exists()).toBe(true)
      expect(lastNameInput.exists()).toBe(true)
      expect(displayNameInput.exists()).toBe(true)
      
      expect(emailLabel.exists()).toBe(true)
      expect(passwordLabel.exists()).toBe(true)
      expect(firstNameLabel.exists()).toBe(true)
      expect(lastNameLabel.exists()).toBe(true)
      expect(displayNameLabel.exists()).toBe(true)
    })

    it('提交按鈕在提交中應顯示為 disabled 狀態', async () => {
      const wrapper = mount(AuthOverlay)
      
      // 填寫表單
      await wrapper.find('.email-input').setValue('test@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      await wrapper.find('.firstname-input').setValue('John')
      await wrapper.find('.lastname-input').setValue('Doe')
      
      // Mock API 延遲回應
      mockFetch.mockImplementation(() => new Promise(() => {}))
      
      // 提交表單
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // 等待下一個 tick
      await wrapper.vm.$nextTick()
      
      const submitBtn = wrapper.find('.register-submit')
      expect(submitBtn.attributes('disabled')).toBeDefined()
      expect(submitBtn.text()).toBe('註冊中...')
    })

    it('成功訊息應在註冊成功後顯示', async () => {
      const wrapper = mount(AuthOverlay)
      
      // 填寫表單
      await wrapper.find('.email-input').setValue('test@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      await wrapper.find('.firstname-input').setValue('John')
      await wrapper.find('.lastname-input').setValue('Doe')
      
      // Mock API 成功回應
      mockFetch.mockResolvedValue({
        email: 'test@example.com',
        userId: '123'
      })
      
      // 提交表單
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // 等待 API 回應
      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()
      
      const successMessage = wrapper.find('.success-message')
      const successText = wrapper.find('.success-text')
      const successBtn = wrapper.find('.success-btn')
      const formElement = wrapper.find('form')
      
      expect(successMessage.exists()).toBe(true)
      expect(successText.text()).toBe('註冊成功！歡迎加入')
      expect(successBtn.exists()).toBe(true)
      expect(formElement.exists()).toBe(false)
    })

    it('錯誤訊息應在欄位驗證失敗時顯示', async () => {
      const wrapper = mount(AuthOverlay)
      
      const emailInput = wrapper.find('.email-input')
      
      // 觸發 blur 事件（空值）
      await emailInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toContain('Email')
    })

    it('關閉按鈕點擊時應觸發 close 事件', async () => {
      const wrapper = mount(AuthOverlay)
      
      const closeBtn = wrapper.find('.close-btn')
      await closeBtn.trigger('click')
      
      expect(wrapper.emitted('close')).toBeTruthy()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('成功訊息中的確定按鈕點擊時應觸發 close 事件', async () => {
      const wrapper = mount(AuthOverlay)
      
      // 先完成註冊流程以顯示成功訊息
      await wrapper.find('.email-input').setValue('test@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      await wrapper.find('.firstname-input').setValue('John')
      await wrapper.find('.lastname-input').setValue('Doe')
      
      mockFetch.mockResolvedValue({
        email: 'test@example.com',
        userId: '123'
      })
      
      await wrapper.find('form').trigger('submit')
      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()
      
      // 點擊確定按鈕
      const successBtn = wrapper.find('.success-btn')
      await successBtn.trigger('click')
      
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('function 邏輯', () => {
    it('Email 欄位為空時應顯示必填錯誤', async () => {
      const wrapper = mount(AuthOverlay)
      
      const emailInput = wrapper.find('.email-input')
      await emailInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Email 為必填欄位')
    })

    it('Email 格式無效時應顯示格式錯誤', async () => {
      const wrapper = mount(AuthOverlay)
      
      const emailInput = wrapper.find('.email-input')
      await emailInput.setValue('invalid-email')
      await emailInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('請輸入有效的 Email 格式')
    })

    it('Password 欄位為空時應顯示必填錯誤', async () => {
      const wrapper = mount(AuthOverlay)
      
      const passwordInput = wrapper.find('.password-input')
      await passwordInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('密碼為必填欄位')
    })

    it('Password 長度不足時應顯示長度錯誤', async () => {
      const wrapper = mount(AuthOverlay)
      
      const passwordInput = wrapper.find('.password-input')
      await passwordInput.setValue('12345')
      await passwordInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('密碼長度至少為 6 個字元')
    })

    it('Password 缺少特殊字元、大寫或小寫時應顯示錯誤', async () => {
      const wrapper = mount(AuthOverlay)
      
      const passwordInput = wrapper.find('.password-input')
      await passwordInput.setValue('password123')
      await passwordInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('密碼須包含一個以上如下字元：特殊字元、英文字母大、小寫')
    })

    it('First Name 欄位為空時應顯示必填錯誤', async () => {
      const wrapper = mount(AuthOverlay)
      
      const firstNameInput = wrapper.find('.firstname-input')
      await firstNameInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('First Name 為必填欄位')
    })

    it('Last Name 欄位為空時應顯示必填錯誤', async () => {
      const wrapper = mount(AuthOverlay)
      
      const lastNameInput = wrapper.find('.lastname-input')
      await lastNameInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Last Name 為必填欄位')
    })

    it('Display Name 欄位為選填，不應顯示驗證錯誤', async () => {
      const wrapper = mount(AuthOverlay)
      
      const displayNameInput = wrapper.find('.displayname-input')
      await displayNameInput.trigger('blur')
      await wrapper.vm.$nextTick()
      
      // Display Name 為選填，不應有錯誤訊息
      const errorMessages = wrapper.findAll('.error-message')
      const displayNameField = wrapper.find('.displayname-field')
      const displayNameError = displayNameField.find('.error-message')
      
      expect(displayNameError.exists()).toBe(false)
    })

    it('表單提交時應驗證所有必填欄位', async () => {
      const wrapper = mount(AuthOverlay)
      
      // 不填寫任何欄位，直接提交
      const form = wrapper.find('form')
      await form.trigger('submit')
      await wrapper.vm.$nextTick()
      
      // 應該顯示多個錯誤訊息
      const errorMessages = wrapper.findAll('.error-message')
      expect(errorMessages.length).toBeGreaterThan(0)
      
      // 驗證不應發送 API 請求
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Mock API', () => {
    it('API 成功回應時應顯示成功訊息', async () => {
      const wrapper = mount(AuthOverlay)
      
      // 填寫完整且有效的表單資料
      await wrapper.find('.email-input').setValue('test@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      await wrapper.find('.firstname-input').setValue('John')
      await wrapper.find('.lastname-input').setValue('Doe')
      
      // Mock API 返回成功回應
      mockFetch.mockResolvedValue({
        email: 'test@example.com',
        userId: '123'
      })
      
      // 點擊提交按鈕
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // 等待 API 回應
      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()
      
      // 驗證成功訊息顯示
      const successMessage = wrapper.find('.success-message')
      const successText = wrapper.find('.success-text')
      
      expect(successMessage.exists()).toBe(true)
      expect(successText.text()).toBe('註冊成功！歡迎加入')
    })

    it('API 返回欄位級別錯誤時應顯示對應錯誤訊息', async () => {
      const wrapper = mount(AuthOverlay)
      
      // 填寫完整且有效的表單資料
      await wrapper.find('.email-input').setValue('test@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      await wrapper.find('.firstname-input').setValue('John')
      await wrapper.find('.lastname-input').setValue('Doe')
      
      // Mock API 返回欄位級別錯誤
      const errorResponse = {
        data: {
          errors: {
            email: ['此 Email 已被使用']
          }
        },
        statusCode: 400
      }
      
      mockFetch.mockRejectedValue(errorResponse)
      
      // 點擊提交按鈕
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // 等待錯誤處理
      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()
      
      // 驗證錯誤訊息顯示
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('此 Email 已被使用')
    })

    it('API 返回一般錯誤時應正確處理', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const wrapper = mount(AuthOverlay)
      
      // 填寫完整且有效的表單資料
      await wrapper.find('.email-input').setValue('test@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      await wrapper.find('.firstname-input').setValue('John')
      await wrapper.find('.lastname-input').setValue('Doe')
      
      // Mock API 返回一般錯誤（非欄位級別）
      const errorResponse = {
        data: {
          message: '伺服器錯誤'
        },
        statusCode: 500
      }
      
      mockFetch.mockRejectedValue(errorResponse)
      
      // 點擊提交按鈕
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // 等待錯誤處理
      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()
      
      // 驗證 isSubmitting 狀態解除（按鈕不再 disabled）
      const submitBtn = wrapper.find('.register-submit')
      expect(submitBtn.attributes('disabled')).toBeUndefined()
      
      // 驗證錯誤記錄到 console
      expect(consoleSpy).toHaveBeenCalledWith('註冊失敗:', expect.any(Object))
      
      consoleSpy.mockRestore()
    })
  })
})
