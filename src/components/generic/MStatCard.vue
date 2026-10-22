<script setup lang="ts">
import MIcon from './MIcon.vue'

withDefaults(defineProps<{ label: string; value: string | number; hint?: string; icon?: string; tone?: 'brand' | 'accent' | 'mint' | 'sun' }>(), {
  tone: 'brand',
})

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  accent: 'bg-accent-50 text-accent-600',
  mint: 'bg-mint-50 text-mint-600',
  sun: 'bg-sun-50 text-sun-600',
} as const
</script>

<template>
  <div class="rounded-2xl border border-surface-line bg-surface p-5 shadow-soft">
    <div class="flex items-start justify-between">
      <p class="text-sm font-medium text-ink-soft">{{ label }}</p>
      <span v-if="icon" class="grid h-9 w-9 place-items-center rounded-xl" :class="TONES[tone]"><MIcon :name="icon" :size="18" /></span>
    </div>
    <p class="mt-2 font-display text-3xl font-extrabold tracking-tight">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-ink-faint">{{ hint }}</p>
  </div>
</template>
