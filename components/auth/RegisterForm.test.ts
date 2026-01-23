import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterForm from './RegisterForm.vue'

describe('RegisterForm', () => {
  it('應正確渲染所有註冊欄位', () => {
    const wrapper = mount(RegisterForm, {
      props: {
        isLoading: false
      }
    })
    
    expect(wrapper.find('.email-input').exists()).toBe(true)
    expect(wrapper.find('.password-input').exists()).toBe(true)
    expect(wrapper.find('.firstname-input').exists()).toBe(true)
    expect(wrapper.find('.lastname-input').exists()).toBe(true)
    expect(wrapper.find('.displayname-input').exists()).toBe(true)
  })

  it('失焦時應進行基本欄位驗證', async () => {
    const wrapper = mount(RegisterForm, {
      props: {
        isLoading: false
      }
    })
    
    const emailInput = wrapper.find('.email-input')
    await emailInput.trigger('blur')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.error-message').text()).toBe('Email 為必填欄位')
  })

  it('應渲染密碼強度標籤雲', () => {
    const wrapper = mount(RegisterForm, {
      props: {
        isLoading: false
      }
    })
    
    const pills = wrapper.findAll('.criteria-pill')
    expect(pills.length).toBe(4)
    expect(pills[0].text()).toContain('長度')
    expect(pills[1].text()).toContain('特殊字元')
    expect(pills[2].text()).toContain('大寫')
    expect(pills[3].text()).toContain('小寫')
  })

  it('密碼滿足條件時標籤應變為 is-valid 樣式', async () => {
    const wrapper = mount(RegisterForm, {
      props: {
        isLoading: false
      }
    })
    
    await wrapper.find('.password-input').setValue('Password123!')
    await wrapper.vm.$nextTick()
    
    const pills = wrapper.findAll('.criteria-pill')
    pills.forEach(pill => {
      expect(pill.classes()).toContain('is-valid')
    })
  })

  it('密碼未滿足所有條件時提交應顯示錯誤', async () => {
    const wrapper = mount(RegisterForm, {
      props: {
        isLoading: false
      }
    })
    
    await wrapper.find('.email-input').setValue('test@example.com')
    await wrapper.find('.password-input').setValue('weak')
    await wrapper.find('.firstname-input').setValue('John')
    await wrapper.find('.lastname-input').setValue('Doe')
    
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const generalError = wrapper.find('.general-error')
    expect(generalError.exists()).toBe(true)
    expect(generalError.text()).toContain('請先滿足所有密碼檢查條件')
  })

  it('輸入有效資料並提交時應發送 submit 事件', async () => {
    const wrapper = mount(RegisterForm, {
      props: {
        isLoading: false
      }
    })
    
    await wrapper.find('.email-input').setValue('john@example.com')
    await wrapper.find('.password-input').setValue('Password123!')
    await wrapper.find('.firstname-input').setValue('John')
    await wrapper.find('.lastname-input').setValue('Doe')
    
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    const payload = wrapper.emitted('submit')?.[0][0] as any
    expect(payload.email).toBe('john@example.com')
    expect(payload.firstName).toBe('John')
  })

  it('isLoading 為 true 時應禁用按鈕', () => {
    const wrapper = mount(RegisterForm, {
      props: {
        isLoading: true
      }
    })
    
    expect(wrapper.find('.auth-submit').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.auth-submit').text()).toBe('註冊中...')
  })
})
