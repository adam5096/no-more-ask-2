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
    vi.clearAllMocks()
    mockFetch.mockClear()
    mockToken.value = null
    mockUser.value = null
  })

  it('應顯示預設的 登入 標題', () => {
    const wrapper = mount(AuthOverlay)
    expect(wrapper.find('.auth-title').text()).toBe('登入')
  })

  it('點擊 註冊 切換按鈕時應切換模式與標題', async () => {
    const wrapper = mount(AuthOverlay)
    const registerBtn = wrapper.findAll('.switch-btn').find(b => b.text().includes('註冊'))
    await registerBtn?.trigger('click')
    expect(wrapper.find('.auth-title').text()).toBe('註冊')
  })

  it('登入成功時應顯示成功畫面並關閉', async () => {
    const wrapper = mount(AuthOverlay)
    
    // 模擬子組件發送 submit 事件
    const loginForm = wrapper.findComponent({ name: 'LoginForm' })
    mockFetch.mockResolvedValue({
      token: 'fake-token',
      email: 'test@example.com',
      userId: '123'
    })

    await loginForm.vm.$emit('submit', { email: 'test@example.com', password: '123' })
    
    await new Promise(resolve => setTimeout(resolve, 50))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.success-text').text()).toBe('登入成功！正在跳轉...')
  })

  it('關閉按鈕應發送 close 事件', async () => {
    const wrapper = mount(AuthOverlay)
    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})


