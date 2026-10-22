<script setup lang="ts">
import { computed, useId } from 'vue'
import { useOverlay } from '@/composables/useOverlay'
import MIcon from './MIcon.vue'

const props = withDefaults(defineProps<{ title?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; persistent?: boolean }>(), {
  size: 'md',
})

const open = defineModel<boolean>({ default: false })
const titleId = useId()
const close = () => {
  if (!props.persistent) open.value = false
}
useOverlay(open, close)

const WIDTH = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' } as const
const width = computed(() => WIDTH[props.size])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
        <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" @click="close" />
        <section
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          class="modal-panel relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-surface shadow-lift sm:rounded-3xl"
          :class="width"
        >
          <header class="flex items-center justify-between gap-4 border-b border-surface-line px-6 py-4">
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
          <div class="overflow-y-auto px-6 py-5"><slot /></div>
          <footer v-if="$slots.footer" class="flex flex-wrap items-center justify-end gap-2 border-t border-surface-line bg-surface-muted px-6 py-4">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: translateY(24px) scale(0.98);
}
</style>
