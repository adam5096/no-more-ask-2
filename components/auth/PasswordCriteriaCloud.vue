<template>
  <div class="password-criteria-cloud">
    <div 
      v-for="(label, key) in criteriaLabels" 
      :key="key"
      class="criteria-pill"
      :class="{ 'is-valid': criteriaState?.[key] }"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { criteriaLabels, type PasswordCriteria } from '~/composables/usePasswordStrength'

defineProps<{
  criteriaState?: Partial<PasswordCriteria>
}>()
</script>

<style scoped>
.password-criteria-cloud {
  @apply flex flex-wrap gap-2 mt-3;
}

.criteria-pill {
  @apply px-3 py-1 text-xs font-black uppercase tracking-wider;
  @apply border-2 border-gray-900 bg-white text-gray-400;
  @apply transition-all duration-300 ease-in-out;
  @apply rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)];
}

.criteria-pill.is-valid {
  @apply bg-green-400 text-gray-900 border-gray-900;
  @apply rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)];
  @apply translate-x-[1px] translate-y-[1px] shadow-none;
}
</style>
