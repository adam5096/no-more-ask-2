import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('function 邏輯', () => {
    it('初始狀態測試', () => {
      const counter = useCounterStore()
      expect(counter.count).toBe(0)
    })

    it('遞增功能測試', () => {
      const counter = useCounterStore()
      counter.increment()
      expect(counter.count).toBe(1)
    })
  })
})
