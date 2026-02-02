import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatRelativeTime } from './formatTime'

describe('formatRelativeTime', () => {
  // Mock Date.now() 控制時間
  beforeEach(() => {
    vi.useFakeTimers()
    // 固定當前時間為 2026-02-02 12:00:00
    vi.setSystemTime(new Date('2026-02-02T12:00:00+08:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('分鐘級別 (< 60 分鐘)', () => {
    it('0 分鐘前', () => {
      const now = new Date().toISOString()
      expect(formatRelativeTime(now)).toBe('0 分鐘前')
    })

    it('1 分鐘前', () => {
      const oneMinAgo = new Date(Date.now() - 60_000).toISOString()
      expect(formatRelativeTime(oneMinAgo)).toBe('1 分鐘前')
    })

    it('59 分鐘前 (邊界)', () => {
      const fiftyNineMinAgo = new Date(Date.now() - 59 * 60_000).toISOString()
      expect(formatRelativeTime(fiftyNineMinAgo)).toBe('59 分鐘前')
    })
  })

  describe('小時級別 (60 分鐘 ~ 24 小時)', () => {
    it('60 分鐘 = 1 小時前 (邊界)', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60_000).toISOString()
      expect(formatRelativeTime(oneHourAgo)).toBe('1 小時前')
    })

    it('90 分鐘 = 1 小時前 (向下取整)', () => {
      const ninetyMinAgo = new Date(Date.now() - 90 * 60_000).toISOString()
      expect(formatRelativeTime(ninetyMinAgo)).toBe('1 小時前')
    })

    it('23 小時前 (邊界)', () => {
      const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60_000).toISOString()
      expect(formatRelativeTime(twentyThreeHoursAgo)).toBe('23 小時前')
    })
  })

  describe('天級別 (>= 24 小時)', () => {
    it('24 小時 = 1 天前 (邊界)', () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60_000).toISOString()
      expect(formatRelativeTime(oneDayAgo)).toBe('1 天前')
    })

    it('36 小時 = 1 天前 (向下取整)', () => {
      const thirtySixHoursAgo = new Date(Date.now() - 36 * 60 * 60_000).toISOString()
      expect(formatRelativeTime(thirtySixHoursAgo)).toBe('1 天前')
    })

    it('7 天前', () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString()
      expect(formatRelativeTime(sevenDaysAgo)).toBe('7 天前')
    })
  })
})
