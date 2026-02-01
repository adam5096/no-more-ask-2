<script setup lang="ts">
import type { RescueRequestPreview, UserRole } from '~/types/dashboard'

// Props: 接收 RescueRequest Objects & User Role for RBAA
defineProps<{
  requests: RescueRequestPreview[]
  userRole: UserRole | null
  isLoading: boolean
}>()

// Emit: CTAs
defineEmits<{
  createRequest: []
  viewRequest: [id: string]
}>()

// Status 顯示配置
const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: '等待匹配', color: 'bg-yellow-100 text-yellow-800' },
  matched: { label: '已匹配', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: '進行中', color: 'bg-green-100 text-green-800' },
  completed: { label: '已完成', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-800' }
}

// 壓力等級顯示
const stressLevelEmoji = (level: number) => {
  const emojis = ['😌', '😐', '😟', '😰', '🆘']
  return emojis[Math.min(level - 1, 4)]
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
  <div class="rescue-summary">
    <!-- Header with CTA -->
    <div class="summary-header">
      <h3 class="summary-title">
        {{ userRole === 'helper' ? '可接案列表' : '我的救援請求' }}
      </h3>
      <button
        v-if="userRole !== 'helper'"
        class="create-btn"
        @click="$emit('createRequest')"
      >
        🆘 發起求救
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-list">
      <div v-for="i in 2" :key="i" class="skeleton-item">
        <div class="skeleton-line w-3/4" />
        <div class="skeleton-line w-1/2" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="requests.length === 0" class="empty-state">
      <span class="empty-icon">📭</span>
      <p class="empty-text">
        {{ userRole === 'helper' ? '目前無可接案件' : '尚無救援請求' }}
      </p>
    </div>

    <!-- Request List -->
    <ul v-else class="request-list">
      <li
        v-for="request in requests"
        :key="request.id"
        class="request-item"
        @click="$emit('viewRequest', request.id)"
      >
        <div class="request-main">
          <span class="stress-level">{{ stressLevelEmoji(request.stressLevel) }}</span>
          <div class="request-info">
            <span class="request-type">{{ request.type === 'emergency' ? '緊急救援' : '預約救援' }}</span>
            <span class="request-time">{{ formatTime(request.createdAt) }}</span>
          </div>
        </div>
        <div class="request-meta">
          <span
            class="status-badge"
            :class="statusConfig[request.status]?.color"
          >
            {{ statusConfig[request.status]?.label }}
          </span>
          <span v-if="request.matchedHelper" class="helper-tag">
            👤 {{ request.matchedHelper.nickname }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rescue-summary {
  @apply p-4 rounded-lg;
  @apply bg-white border border-gray-200;
  @apply shadow-sm;
}

.summary-header {
  @apply flex items-center justify-between mb-4;
}

.summary-title {
  @apply text-lg font-semibold text-gray-800;
}

.create-btn {
  @apply px-3 py-1.5;
  @apply text-sm font-medium;
  @apply bg-red-500 text-white;
  @apply rounded-lg;
  @apply transition-all duration-200;
  @apply hover:bg-red-600 hover:rounded-full;
  @apply active:scale-95;
}

.loading-list {
  @apply space-y-3;
}

.skeleton-item {
  @apply p-3 rounded-lg bg-gray-50;
  @apply space-y-2;
}

.skeleton-line {
  @apply h-4 bg-gray-200 rounded animate-pulse;
}

.empty-state {
  @apply flex flex-col items-center py-8;
  @apply text-gray-400;
}

.empty-icon {
  @apply text-4xl mb-2;
}

.empty-text {
  @apply text-sm;
}

.request-list {
  @apply space-y-2;
}

.request-item {
  @apply p-3 rounded-lg;
  @apply bg-gray-50;
  @apply cursor-pointer;
  @apply transition-all duration-200;
  @apply hover:bg-gray-100;
}

.request-main {
  @apply flex items-center gap-3 mb-2;
}

.stress-level {
  @apply text-2xl;
}

.request-info {
  @apply flex flex-col;
}

.request-type {
  @apply text-sm font-medium text-gray-800;
}

.request-time {
  @apply text-xs text-gray-500;
}

.request-meta {
  @apply flex items-center gap-2;
}

.status-badge {
  @apply px-2 py-0.5;
  @apply text-xs font-medium rounded-full;
}

.helper-tag {
  @apply text-xs text-gray-500;
}
</style>
