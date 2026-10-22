<script setup lang="ts">
import { ref, watch } from 'vue'
import MIcon from './MIcon.vue'

const props = withDefaults(defineProps<{ placeholder?: string; debounce?: number }>(), {
  placeholder: 'Rechercher…',
  debounce: 250,
})

/** Debounced value: parents filter on this, typing stays instant. */
const model = defineModel<string>({ default: '' })
const draft = ref(model.value)
let timer: ReturnType<typeof setTimeout> | undefined

watch(draft, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => (model.value = value), props.debounce)
})
watch(model, (value) => {
  if (value !== draft.value) draft.value = value
})

const clear = () => {
  draft.value = ''
  model.value = ''
}
</script>

<template>
  <div
    class="flex h-10 w-full items-center gap-2 rounded-xl border border-surface-line bg-surface px-3 transition focus-within:border-brand-500 focus-within:shadow-ring"
    role="search"
  >
    <MIcon name="search" :size="16" class="text-ink-faint" />
    <input
      v-model="draft"
      type="search"
      :placeholder="placeholder"
      :aria-label="placeholder"
      class="h-full w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
      @keydown.esc="clear"
    />
    <button v-if="draft" type="button" class="text-ink-faint hover:text-ink" aria-label="Effacer" @click="clear">
      <MIcon name="x" :size="16" />
    </button>
  </div>
</template>
