<script setup lang="ts">
import type { UserMinimal } from '~/types/dashboard'

// Props: 接收 User Object (ORCA Blue Note)
defineProps<{
  user: UserMinimal | null
}>()

// Emit: CTA - 編輯個人資料
defineEmits<{
  editProfile: []
}>()

// Role 顯示名稱對應
const roleLabels: Record<string, string> = {
  escapee: '焦慮求助者',
  helper: '專業閒人',
  woke_elder: '覺醒長輩',
  silent_buffer: '夾心配偶',
  urban_loner: '節慶自由人'
}

// Status 顏色對應
const statusColors: Record<string, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-yellow-500'
}
</script>

<template>
  <div class="profile-card">
    <!-- Loading State -->
    <template v-if="!user">
      <div class="profile-skeleton">
        <div class="skeleton-avatar" />
        <div class="skeleton-info">
          <div class="skeleton-line w-24" />
          <div class="skeleton-line w-16" />
        </div>
      </div>
    </template>

    <!-- Loaded State -->
    <template v-else>
      <div class="profile-header">
        <!-- Avatar -->
        <div class="avatar-container">
          <img
            v-if="user.avatarUrl"
            :src="user.avatarUrl"
            :alt="user.nickname"
            class="avatar-img"
          >
          <div v-else class="avatar-placeholder">
            {{ user.nickname.charAt(0) }}
          </div>
          <!-- Status Indicator -->
          <span
            class="status-indicator"
            :class="statusColors[user.status]"
          />
        </div>

        <!-- User Info -->
        <div class="user-info">
          <h2 class="user-nickname">{{ user.nickname }}</h2>
          <span class="user-role">{{ roleLabels[user.role] || user.role }}</span>
        </div>
      </div>

      <!-- CTA: Edit Profile -->
      <button
        class="edit-btn"
        @click="$emit('editProfile')"
      >
        編輯個人資料
      </button>
    </template>
  </div>
</template>

<style scoped>
.profile-card {
  @apply p-4 rounded-lg;
  @apply bg-white border border-gray-200;
  @apply shadow-sm;
}

.profile-header {
  @apply flex items-center gap-4 mb-4;
}

.avatar-container {
  @apply relative;
}

.avatar-img,
.avatar-placeholder {
  @apply w-16 h-16 rounded-full;
}

.avatar-img {
  @apply object-cover;
}

.avatar-placeholder {
  @apply bg-gradient-to-br from-blue-500 to-purple-600;
  @apply flex items-center justify-center;
  @apply text-white text-2xl font-bold;
}

.status-indicator {
  @apply absolute bottom-0 right-0;
  @apply w-4 h-4 rounded-full;
  @apply border-2 border-white;
}

.user-info {
  @apply flex flex-col;
}

.user-nickname {
  @apply text-lg font-semibold text-gray-800;
}

.user-role {
  @apply text-sm text-gray-500;
}

.edit-btn {
  @apply w-full py-2 px-4;
  @apply text-sm font-medium;
  @apply bg-gray-100 text-gray-700;
  @apply rounded-lg;
  @apply transition-all duration-200;
  @apply hover:bg-gray-200 hover:rounded-full;
  @apply active:scale-95;
}

/* Skeleton Loading */
.profile-skeleton {
  @apply flex items-center gap-4;
}

.skeleton-avatar {
  @apply w-16 h-16 rounded-full bg-gray-200 animate-pulse;
}

.skeleton-info {
  @apply flex flex-col gap-2;
}

.skeleton-line {
  @apply h-4 bg-gray-200 rounded animate-pulse;
}
</style>
