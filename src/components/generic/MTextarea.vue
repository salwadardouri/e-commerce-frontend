<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{ label?: string; placeholder?: string; error?: string; hint?: string; rows?: number; required?: boolean }>(),
  { rows: 4 },
)

const model = defineModel<string | null>()
const id = useId()
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1.5 block text-sm font-medium text-ink">
      {{ label }}<span v-if="required" class="text-accent-500"> *</span>
    </label>
    <textarea
      :id="id"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="!!error"
      class="w-full resize-y rounded-xl border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-500 focus:shadow-ring"
      :class="error ? 'border-danger-500' : 'border-surface-line'"
    />
    <p v-if="error" class="mt-1 text-xs text-danger-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-ink-faint">{{ hint }}</p>
  </div>
</template>
