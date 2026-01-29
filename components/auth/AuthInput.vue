<template>
  <div class="form-field">
    <label v-if="label" class="form-label" :for="id">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        class="form-input"
        :class="[{ 'input-error': errors?.length }, inputClass]"
        :disabled="disabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', id)"
      />
      <slot name="suffix"></slot>
    </div>
    <div v-if="errors?.length" class="error-message">
      {{ errors[0] }}
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  id: string
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  errors?: string[]
  inputClass?: Record<string, boolean> | string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  'blur': [id: string]
}>()
</script>

<style scoped>
.form-field {
  @apply flex flex-col gap-2;
}

.form-label {
  @apply font-bold text-sm uppercase tracking-wider text-gray-700;
}

.input-wrapper {
  @apply relative flex flex-col;
}

.form-input {
  @apply border-2 border-gray-300 px-4 py-2 font-medium w-full;
  @apply transition-all duration-200;
  @apply focus:border-gray-900 focus:outline-none;
  @apply hover:rounded-full; /* 根據全域規範 */
  @apply active:scale-[0.98]; /* 輕微縮放，保持穩定 */
  font-size: clamp(0.9rem, 1vw + 0.8rem, 1.1rem);
}

.input-error {
  @apply border-red-500;
}

.error-message {
  @apply text-red-500 text-sm font-medium mt-1;
}
</style>
