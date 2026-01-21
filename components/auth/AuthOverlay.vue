<template>
  <div class="component-auth-overlay">
    <div class="component-auth-modal">
      <header class="component-auth-header">
        <h2 class="component-auth-title">User Registration</h2>
        <button class="component-auth-close" @click="$emit('close')">×</button>
      </header>

      <form class="component-auth-form" @submit.prevent>
        <div class="component-auth-grid">
          <div class="component-auth-field">
            <label class="component-auth-label">Email</label>
            <input type="email" placeholder="user@example.com" class="component-auth-input" />
          </div>
          <div class="component-auth-field">
            <label class="component-auth-label">Password</label>
            <input type="password" class="component-auth-input" />
          </div>
          <div class="component-auth-row">
            <div class="component-auth-field flex-grow min-w-0">
              <label class="component-auth-label">First Name</label>
              <input type="text" class="component-auth-input" />
            </div>
            <div class="component-auth-field flex-grow min-w-0">
              <label class="component-auth-label">Last Name</label>
              <input type="text" class="component-auth-input" />
            </div>
          </div>
          <div class="component-auth-field">
            <label class="component-auth-label">Display Name</label>
            <input type="text" class="component-auth-input" />
          </div>
        </div>

        <div class="component-auth-footer">
          <button class="component-auth-submit">Submit Registration</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.component-auth-overlay {
  @apply fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm;
}

.component-auth-modal {
  @apply bg-white border-4 border-gray-900 w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)];
  @apply flex flex-col;
}

.component-auth-header {
  @apply flex justify-between items-center border-b-4 border-gray-900 px-6 py-4;
}

.component-auth-title {
  @apply font-black uppercase tracking-tight;
  font-size: clamp(1.5rem, 3vw + 1.2rem, 2.2rem);
}

.component-auth-close {
  @apply text-3xl font-bold hover:scale-110 active:scale-90 transition-transform;
}

.component-auth-form {
  @apply p-8 flex flex-col gap-6;
}

.component-auth-grid {
  @apply flex flex-col gap-5;
}

.component-auth-row {
  @apply flex flex-col sm:flex-row gap-5;
}

.component-auth-field {
  @apply flex flex-col gap-2;
}

.component-auth-label {
  @apply font-bold text-sm uppercase tracking-wider text-gray-700;
}

.component-auth-input {
  @apply border-2 border-gray-300 px-4 py-2 font-medium w-full;
  @apply transition-all duration-200;
  @apply focus:border-gray-900 focus:outline-none;
  font-size: clamp(0.9rem, 1vw + 0.8rem, 1.1rem);
}

.component-auth-footer {
  @apply border-t-2 border-gray-200 pt-6;
}

.component-auth-submit {
  @apply w-full bg-gray-900 text-white font-black py-4 uppercase tracking-widest;
  @apply transition-all duration-200;
  @apply hover:bg-gray-800 active:scale-95;
  font-size: clamp(1rem, 1.5vw + 0.9rem, 1.3rem);
}
</style>
