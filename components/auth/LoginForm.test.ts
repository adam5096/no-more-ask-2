import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from './LoginForm.vue'

describe('LoginForm', () => {
  it('應正確渲染 Email 與 Password 欄位', () => {
    const wrapper = mount(LoginForm, {
      props: {
        isLoading: false
      }
    })
    
    expect(wrapper.find('.email-input').exists()).toBe(true)
    expect(wrapper.find('.password-input').exists()).toBe(true)
  })

  it('應顯示密碼組成規則提醒', () => {
    const wrapper = mount(LoginForm, {
      props: {
        isLoading: false
      }
    })
    
    expect(wrapper.find('.login-hint').exists()).toBe(true)
    expect(wrapper.findAll('.criteria-pill').length).toBe(4)
  })

  it('登入時輸入密碼應同步觸發提醒標籤的有效狀態', async () => {
    const wrapper = mount(LoginForm, {
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

  it('失焦時應進行欄位驗證', async () => {
    const wrapper = mount(LoginForm, {
      props: {
        isLoading: false
      }
    })
    
    const emailInput = wrapper.find('.email-input')
    await emailInput.trigger('blur')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.error-message').text()).toBe('Email 為必填欄位')
  })

  it('輸入有效資料並提交時應發送 submit 事件', async () => {
    const wrapper = mount(LoginForm, {
      props: {
        isLoading: false
      }
    })
    
    await wrapper.find('.email-input').setValue('test@example.com')
    await wrapper.find('.password-input').setValue('password123')
    
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')?.[0][0]).toEqual({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('isLoading 為 true 時應禁用輸入與按鈕', () => {
    const wrapper = mount(LoginForm, {
      props: {
        isLoading: true
      }
    })
    
    expect(wrapper.find('.email-input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.password-input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.auth-submit').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.auth-submit').text()).toBe('登入中...')
  })

  it('應顯示來自外部的錯誤訊息', () => {
    const wrapper = mount(LoginForm, {
      props: {
        isLoading: false,
        externalErrors: {
          message: ['帳號或密碼錯誤']
        }
      }
    })
    
    expect(wrapper.find('.general-error').text()).toBe('帳號或密碼錯誤')
  })
})
