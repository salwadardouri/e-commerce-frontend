<script setup lang="ts" generic="V extends string | number">
import { useId } from 'vue'
import MIcon from './MIcon.vue'

export interface SelectOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}

defineProps<{
  options: SelectOption<V>[]
  label?: string
  /** Adds a first empty option with this text (value = "") */
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>()

const model = defineModel<V | ''>()
const id = useId()
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1.5 block text-sm font-medium text-ink">
      {{ label }}<span v-if="required" class="text-accent-500"> *</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        v-model="model"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error"
        class="h-10 w-full appearance-none rounded-xl border bg-surface pl-3 pr-9 text-sm text-ink outline-none transition focus:border-brand-500 focus:shadow-ring disabled:opacity-60"
        :class="error ? 'border-danger-500' : 'border-surface-line'"
      >
        <option v-if="placeholder !== undefined" value="">{{ placeholder }}</option>
        <option v-for="o in options" :key="o.value" :value="o.value" :disabled="o.disabled">{{ o.label }}</option>
      </select>
      <MIcon name="chevron-down" :size="16" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
    </div>
    <p v-if="error" class="mt-1 text-xs text-danger-600">{{ error }}</p>
  </div>
</template>
