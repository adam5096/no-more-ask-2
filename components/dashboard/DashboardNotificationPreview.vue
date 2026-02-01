<script setup lang="ts">
import type { NotificationPreview } from '~/types/dashboard'

// Props
defineProps<{
  unreadCount: number
  notifications: NotificationPreview[]
  isLoading: boolean
}>()

// Emit: CTAs
defineEmits<{
  viewAll: []
  markAsRead: [id: string]
}>()

// 通知類型圖示
const typeIcons: Record<string, string> = {
  rescue_match: '🤝',
  survival_check: '💚',
  gathering_invite: '🎉',
  helper_request: '🦸'
}

// 格式化時間
const formatTime = (isoDate: string) => {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 60) return `${diffMins} 分鐘前`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} 小時前`
  return `${Math.floor(diffMins / 1440)} 天前`
}
</script>

<template>
  <div class="notification-preview">
    <!-- Header -->
    <div class="preview-header">
      <h3 class="preview-title">
        通知
        <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </h3>
      <button
        class="view-all-btn"
        @click="$emit('viewAll')"
      >
        查看全部
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-list">
      <div v-for="i in 2" :key="i" class="skeleton-item" />
    </div>

    <!-- Empty State -->
    <div v-else-if="notifications.length === 0" class="empty-state">
      <span class="empty-icon">🔔</span>
      <p class="empty-text">暫無通知</p>
    </div>

    <!-- Notification List -->
    <ul v-else class="notification-list">
      <li
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="{ 'is-unread': !notification.isRead }"
        @click="$emit('markAsRead', notification.id)"
      >
        <span class="notification-icon">{{ typeIcons[notification.type] || '📬' }}</span>
        <div class="notification-content">
          <p class="notification-title">{{ notification.title }}</p>
          <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
        </div>
        <span v-if="!notification.isRead" class="unread-dot" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.notification-preview {
  @apply p-4 rounded-lg;
  @apply bg-white border border-gray-200;
  @apply shadow-sm;
}

.preview-header {
  @apply flex items-center justify-between mb-4;
}

.preview-title {
  @apply text-lg font-semibold text-gray-800;
  @apply flex items-center gap-2;
}

.unread-badge {
  @apply px-2 py-0.5;
  @apply text-xs font-bold;
  @apply bg-red-500 text-white rounded-full;
}

.view-all-btn {
  @apply text-sm text-blue-600;
  @apply hover:underline;
}

.loading-list {
  @apply space-y-2;
}

.skeleton-item {
  @apply h-12 bg-gray-100 rounded-lg animate-pulse;
}

.empty-state {
  @apply flex flex-col items-center py-6;
  @apply text-gray-400;
}

.empty-icon {
  @apply text-3xl mb-1;
}

.empty-text {
  @apply text-sm;
}

.notification-list {
  @apply space-y-2;
}

.notification-item {
  @apply flex items-center gap-3 p-3;
  @apply rounded-lg cursor-pointer;
  @apply transition-colors duration-200;
  @apply hover:bg-gray-50;
}

.notification-item.is-unread {
  @apply bg-blue-50;
}

.notification-icon {
  @apply text-xl;
}

.notification-content {
  @apply flex-1 min-w-0;
}

.notification-title {
  @apply text-sm text-gray-800 truncate;
}

.notification-time {
  @apply text-xs text-gray-500;
}

.unread-dot {
  @apply w-2 h-2;
  @apply bg-blue-500 rounded-full;
}
</style>
