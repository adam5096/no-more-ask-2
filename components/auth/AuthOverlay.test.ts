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

  const switchToRegister = async (wrapper: any) => {
    const registerBtn = wrapper.findAll('.switch-btn').find((b: any) => b.text() === 'Register')
    await registerBtn.trigger('click')
    await wrapper.vm.$nextTick()
  }

  describe('登入功能 (預設)', () => {
    it('標題應顯示為 User Login', () => {
      const wrapper = mount(AuthOverlay)
      expect(wrapper.find('.auth-title').text()).toBe('User Login')
    })

    it('應正確渲染登入表單欄位', () => {
      const wrapper = mount(AuthOverlay)
      expect(wrapper.find('.email-input').exists()).toBe(true)
      expect(wrapper.find('.password-input').exists()).toBe(true)
      expect(wrapper.find('.firstname-input').exists()).toBe(false)
    })

    it('登入成功時應調用 auth.login 並顯示成功訊息', async () => {
      const wrapper = mount(AuthOverlay)
      
      await wrapper.find('.email-input').setValue('login@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      
      mockFetch.mockResolvedValue({
        token: 'fake-token',
        email: 'login@example.com',
        userId: 'user-123'
      })
      
      await wrapper.find('form').trigger('submit')
      
      // 等待 API 與狀態更新
      await new Promise(resolve => setTimeout(resolve, 50))
      await wrapper.vm.$nextTick()
      
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth/login', expect.objectContaining({
        method: 'POST',
        body: { email: 'login@example.com', password: 'Password123!' }
      }))
      
      expect(mockToken.value).toBe('fake-token')
      expect(mockUser.value?.email).toBe('login@example.com')
      expect(wrapper.find('.success-text').text()).toBe('登入成功！正在跳轉...')
    })

    it('登入失敗時應顯示錯誤訊息', async () => {
      const wrapper = mount(AuthOverlay)
      
      await wrapper.find('.email-input').setValue('wrong@example.com')
      await wrapper.find('.password-input').setValue('wrongpass')
      
      mockFetch.mockRejectedValue({
        data: {
          errors: { message: ['帳號或密碼錯誤'] }
        }
      })
      
      await wrapper.find('form').trigger('submit')
      await new Promise(resolve => setTimeout(resolve, 50))
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.general-error').text()).toContain('帳號或密碼錯誤')
    })
  })

  describe('註冊功能 (切換後)', () => {
    it('切換至 Register 時標題應改變', async () => {
      const wrapper = mount(AuthOverlay)
      await switchToRegister(wrapper)
      expect(wrapper.find('.auth-title').text()).toBe('User Registration')
    })

    it('應正確渲染註冊表單欄位', async () => {
      const wrapper = mount(AuthOverlay)
      await switchToRegister(wrapper)
      
      expect(wrapper.find('.email-input').exists()).toBe(true)
      expect(wrapper.find('.password-input').exists()).toBe(true)
      expect(wrapper.find('.firstname-input').exists()).toBe(true)
      expect(wrapper.find('.lastname-input').exists()).toBe(true)
    })

    it('註冊成功時應調用 auth.register 並顯示成功訊息', async () => {
      const wrapper = mount(AuthOverlay)
      await switchToRegister(wrapper)
      
      await wrapper.find('.email-input').setValue('test@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      await wrapper.find('.firstname-input').setValue('John')
      await wrapper.find('.lastname-input').setValue('Doe')
      
      mockFetch.mockResolvedValue({
        email: 'test@example.com',
        userId: '123'
      })
      
      await wrapper.find('form').trigger('submit')
      await new Promise(resolve => setTimeout(resolve, 50))
      await wrapper.vm.$nextTick()
      
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth/register', expect.any(Object))
      expect(mockUser.value?.email).toBe('test@example.com')
      expect(wrapper.find('.success-text').text()).toBe('註冊成功！歡迎加入')
    })
  })

  describe('通用 UI 互動', () => {
    it('關閉按鈕點擊時應觸發 close 事件', async () => {
      const wrapper = mount(AuthOverlay)
      const closeBtn = wrapper.find('.close-btn')
      await closeBtn.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('在提交中按鈕應顯示為 disabled', async () => {
      const wrapper = mount(AuthOverlay)
      await wrapper.find('.email-input').setValue('test@example.com')
      await wrapper.find('.password-input').setValue('Password123!')
      
      mockFetch.mockImplementation(() => new Promise(() => {}))
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
      
      const submitBtn = wrapper.find('.auth-submit')
      expect(submitBtn.attributes('disabled')).toBeDefined()
      expect(submitBtn.text()).toBe('登入中...')
    })
  })
})

