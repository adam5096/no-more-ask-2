/**
 * 格式化相對時間
 * 純函數：相同輸入產生相同輸出
 */
export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 60) return `${diffMins} 分鐘前`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} 小時前`
  return `${Math.floor(diffMins / 1440)} 天前`
}
