<script setup lang="ts">
defineProps<{ label?: string; disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="inline-flex cursor-pointer items-center gap-2.5" :class="disabled && 'cursor-not-allowed opacity-60'">
    <button
      type="button"
      role="switch"
      :aria-checked="model"
      :disabled="disabled"
      class="relative h-6 w-11 rounded-full transition"
      :class="model ? 'bg-brand-gradient' : 'bg-surface-line'"
      @click="model = !model"
    >
      <span
        class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
        :class="model && 'translate-x-5'"
      />
    </button>
    <span v-if="label || $slots.default" class="text-sm text-ink"><slot>{{ label }}</slot></span>
  </label>
</template>
