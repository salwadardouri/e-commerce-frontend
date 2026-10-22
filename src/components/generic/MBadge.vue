<script setup lang="ts">
import type { Tone } from '@/lib/format'

withDefaults(defineProps<{ tone?: Tone; dot?: boolean }>(), { tone: 'neutral' })

const TONES: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: 'bg-surface-sunken text-ink-soft', dot: 'bg-ink-faint' },
  brand: { box: 'bg-brand-50 text-brand-700', dot: 'bg-brand-500' },
  success: { box: 'bg-mint-50 text-mint-700', dot: 'bg-mint-500' },
  warning: { box: 'bg-sun-50 text-sun-700', dot: 'bg-sun-500' },
  danger: { box: 'bg-danger-50 text-danger-700', dot: 'bg-danger-500' },
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="TONES[tone].box">
    <span v-if="dot" class="h-1.5 w-1.5 rounded-full" :class="TONES[tone].dot" />
    <slot />
  </span>
</template>
