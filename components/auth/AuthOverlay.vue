<template>
  <div class="auth-overlay">
    <div class="auth-modal">
      <header class="auth-header">
        <h2 class="auth-title">User Registration</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <form class="auth-form" @submit.prevent>
        <div class="form-grid">
          <div class="email-field">
            <label class="email-label">Email</label>
            <input type="email" placeholder="user@example.com" class="email-input" />
          </div>
          <div class="password-field">
            <label class="password-label">Password</label>
            <input type="password" class="password-input" />
          </div>
          <div class="name-row">
            <div class="firstname-field">
              <label class="firstname-label">First Name</label>
              <input type="text" class="firstname-input" />
            </div>
            <div class="lastname-field">
              <label class="lastname-label">Last Name</label>
              <input type="text" class="lastname-input" />
            </div>
          </div>
          <div class="displayname-field">
            <label class="displayname-label">Display Name</label>
            <input type="text" class="displayname-input" />
          </div>
        </div>

        <div class="form-footer">
          <button class="register-submit">Submit Registration</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.auth-overlay {
  @apply fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm;
}

.auth-modal {
  @apply bg-white border-4 border-gray-900 w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)];
  @apply flex flex-col;
}

.auth-header {
  @apply flex justify-between items-center border-b-4 border-gray-900 px-6 py-4;
}

.auth-title {
  @apply font-black uppercase tracking-tight;
  font-size: clamp(1.5rem, 3vw + 1.2rem, 2.2rem);
}

.close-btn {
  @apply text-3xl font-bold hover:scale-110 active:scale-90 transition-transform;
}

.auth-form {
  @apply p-8 flex flex-col gap-6;
}

.form-grid {
  @apply flex flex-col gap-5;
}

.name-row {
  @apply flex flex-col sm:flex-row gap-5;
}

/* Base input style */
.email-input, .password-input, .firstname-input, .lastname-input, .displayname-input {
  @apply border-2 border-gray-300 px-4 py-2 font-medium w-full;
  @apply transition-all duration-200;
  @apply focus:border-gray-900 focus:outline-none;
  font-size: clamp(0.9rem, 1vw + 0.8rem, 1.1rem);
}

/* Base label style */
.email-label, .password-label, .firstname-label, .lastname-label, .displayname-label {
  @apply font-bold text-sm uppercase tracking-wider text-gray-700;
}

/* Base field style */
.email-field, .password-field, .firstname-field, .lastname-field, .displayname-field {
  @apply flex flex-col gap-2 min-w-0;
}

.firstname-field, .lastname-field {
  @apply flex-grow;
}

.form-footer {
  @apply border-t-2 border-gray-200 pt-6;
}

.register-submit {
  @apply w-full bg-gray-900 text-white font-black py-4 uppercase tracking-widest;
  @apply transition-all duration-200;
  @apply hover:bg-gray-800 active:scale-95;
  font-size: clamp(1rem, 1.5vw + 0.9rem, 1.3rem);
}
</style>
