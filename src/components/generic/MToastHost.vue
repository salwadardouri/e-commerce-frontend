<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import MIcon from './MIcon.vue'

const { toasts, dismiss } = useToast()

const STYLE = {
  success: { box: 'border-mint-500/30', icon: 'check', color: 'bg-mint-500' },
  error: { box: 'border-danger-500/30', icon: 'alert', color: 'bg-danger-500' },
  info: { box: 'border-brand-500/30', icon: 'sparkles', color: 'bg-brand-500' },
} as const
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border bg-surface px-4 py-3 text-sm font-medium shadow-lift"
          :class="STYLE[t.tone].box"
          role="status"
        >
          <span class="grid h-6 w-6 place-items-center rounded-full text-white" :class="STYLE[t.tone].color">
            <MIcon :name="STYLE[t.tone].icon" :size="14" :stroke="2.6" />
          </span>
          <span>{{ t.message }}</span>
          <button type="button" class="ml-1 text-ink-faint hover:text-ink" aria-label="Fermer" @click="dismiss(t.id)"><MIcon name="x" :size="14" /></button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
