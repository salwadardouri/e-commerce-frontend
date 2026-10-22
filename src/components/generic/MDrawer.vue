<script setup lang="ts">
import { useId } from 'vue'
import { useOverlay } from '@/composables/useOverlay'
import MIcon from './MIcon.vue'

defineProps<{ title?: string }>()

const open = defineModel<boolean>({ default: false })
const titleId = useId()
useOverlay(open, () => (open.value = false))
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-50">
        <div class="drawer-backdrop absolute inset-0 bg-ink/50 backdrop-blur-sm" @click="open = false" />
        <aside
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          class="drawer-panel absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-lift"
        >
          <header class="flex items-center justify-between border-b border-surface-line px-5 py-4">
            <slot name="header">
              <h2 :id="titleId" class="text-lg font-bold">{{ title }}</h2>
            </slot>
            <button
              type="button"
              class="rounded-lg p-1.5 text-ink-faint transition hover:bg-surface-sunken hover:text-ink"
              aria-label="Fermer"
              @click="open = false"
            >
              <MIcon name="x" />
            </button>
          </header>
          <div class="flex-1 overflow-y-auto px-5 py-4"><slot /></div>
          <footer v-if="$slots.footer" class="border-t border-surface-line bg-surface-muted px-5 py-4">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active,
.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
