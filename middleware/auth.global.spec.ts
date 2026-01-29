import { describe, it, expect } from 'vitest'
import { resolveAuthAction } from './auth.global'

describe('Auth Middleware 決策邏輯', () => {
  describe('驗證權限', () => {
    it('公開頁面應直接放行', () => {
      const result = resolveAuthAction(
        { public: true },
        '/login',
        1,
        { isAuthenticated: false, isDev: false }
      )
      expect(result).toBe('allow')
    })

    it('開發環境下的開發專用頁面應放行', () => {
      const result = resolveAuthAction(
        { devOnly: true },
        '/debug',
        1,
        { isAuthenticated: false, isDev: true }
      )
      expect(result).toBe('allow')
    })

    it('首頁路徑應視為隱性公開並放行', () => {
      const result = resolveAuthAction(
        {},
        '/',
        1,
        { isAuthenticated: false, isDev: false }
      )
      expect(result).toBe('allow')
    })

    it('已登入者進入 404 路徑應放行（交給 error.vue 處理）', () => {
      const result = resolveAuthAction(
        {},
        '/non-existent',
        0,
        { isAuthenticated: true, isDev: false }
      )
      expect(result).toBe('allow')
    })

    it('未登入者進入 404 路徑應重定向至首頁（隱蔽探測）', () => {
      const result = resolveAuthAction(
        {},
        '/non-existent',
        0,
        { isAuthenticated: false, isDev: false }
      )
      expect(result).toBe('redirect-home')
    })

    it('未登入者進入私有頁面應重定向至首頁', () => {
      const result = resolveAuthAction(
        {},
        '/dashboard',
        1,
        { isAuthenticated: false, isDev: false }
      )
      expect(result).toBe('redirect-home')
    })

    it('已登入者進入私有頁面應放行', () => {
      const result = resolveAuthAction(
        {},
        '/dashboard',
        1,
        { isAuthenticated: true, isDev: false }
      )
      expect(result).toBe('allow')
    })
  })
})
