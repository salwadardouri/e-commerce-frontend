<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label?: string
  type?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  min?: number | string
  max?: number | string
  step?: number | string
  autocomplete?: string
}>()

const model = defineModel<string | number | null>()
const id = useId()
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1.5 block text-sm font-medium text-ink">
      {{ label }}<span v-if="required" class="text-accent-500"> *</span>
    </label>
    <div
      class="flex items-center rounded-xl border bg-surface transition focus-within:border-brand-500 focus-within:shadow-ring"
      :class="error ? 'border-danger-500' : 'border-surface-line'"
    >
      <span v-if="$slots.prefix" class="pl-3 text-ink-faint"><slot name="prefix" /></span>
      <input
        :id="id"
        v-model="model"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        :aria-invalid="!!error"
        class="h-10 w-full min-w-0 rounded-xl bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-faint disabled:opacity-60"
      />
      <span v-if="$slots.suffix" class="pr-3 text-sm text-ink-faint"><slot name="suffix" /></span>
    </div>
    <p v-if="error" class="mt-1 text-xs text-danger-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-ink-faint">{{ hint }}</p>
  </div>
</template>
