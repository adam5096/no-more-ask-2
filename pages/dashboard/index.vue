<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  devOnly: true
})

// Data Layer: 使用 Dashboard Composable
const {
  user,
  rescueRequests,
  notifications,
  isLoading,
  refresh
} = useDashboard()

// 初始載入
onMounted(() => {
  refresh()
})

// CTA Handlers
const handleEditProfile = () => {
  // TODO: Navigate to profile edit page
  console.log('Edit profile clicked')
}

const handleCreateRequest = () => {
  // TODO: Navigate to create rescue request
  navigateTo('/rescue-request/create')
}

const handleViewRequest = (id: string) => {
  navigateTo(`/rescue-request/${id}`)
}

const handleViewAllNotifications = () => {
  navigateTo('/notifications')
}

const handleMarkAsRead = (id: string) => {
  // TODO: Call API to mark notification as read
  console.log('Mark as read:', id)
}
</script>

<template>
  <section class="dashboard-content">
    <h1 class="content-title">儀表板</h1>

    <div class="dashboard-grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <!-- Profile Card -->
      <DashboardProfileCard
        :user="user"
        @edit-profile="handleEditProfile"
      />

      <!-- Rescue Summary -->
      <DashboardRescueSummary
        :requests="rescueRequests"
        :user-role="user?.role ?? null"
        :is-loading="isLoading"
        @create-request="handleCreateRequest"
        @view-request="handleViewRequest"
      />

      <!-- Notification Preview -->
      <DashboardNotificationPreview
        :unread-count="notifications.unreadCount"
        :notifications="notifications.recent"
        :is-loading="isLoading"
        @view-all="handleViewAllNotifications"
        @mark-as-read="handleMarkAsRead"
      />
    </div>
  </section>
</template>

<style scoped>
.dashboard-content {
  @apply flex flex-col gap-6;
}

.content-title {
  @apply text-2xl font-bold;
  @apply border-b border-gray-300 pb-2;
}

.dashboard-grid {
  @apply grid gap-4;
}

</style>

