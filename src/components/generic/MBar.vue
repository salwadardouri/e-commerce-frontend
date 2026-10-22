<script setup lang="ts">
import MIcon from './MIcon.vue'

withDefaults(
  defineProps<{
    tone?: 'brand' | 'dark' | 'soft' | 'warning'
    dismissible?: boolean
  }>(),
  { tone: 'brand' },
)

const emit = defineEmits<{ dismiss: [] }>()

const TONES = {
  brand: 'bg-brand-gradient text-white',
  dark: 'bg-ink text-white',
  soft: 'bg-brand-50 text-brand-800',
  warning: 'bg-sun-100 text-sun-700',
} as const
</script>

<template>
  <div class="relative text-sm font-medium" :class="TONES[tone]" role="region">
    <div class="container-page flex min-h-10 items-center justify-between gap-3 py-2">
      <div class="flex items-center gap-2"><slot name="start" /></div>
      <div class="flex-1 text-center"><slot /></div>
      <div class="flex items-center gap-2">
        <slot name="end" />
        <button v-if="dismissible" type="button" class="rounded p-1 opacity-80 hover:opacity-100" aria-label="Fermer" @click="emit('dismiss')">
          <MIcon name="x" :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
