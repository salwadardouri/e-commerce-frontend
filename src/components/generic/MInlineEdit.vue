<script setup lang="ts">
import { nextTick, ref } from 'vue'
import MIcon from './MIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    /** When false the slot is rendered as plain content (visitor view). */
    editable?: boolean
    type?: 'text' | 'number'
    min?: number
    step?: number
    inputClass?: string
  }>(),
  { editable: false, type: 'text', step: 1 },
)

const emit = defineEmits<{ save: [value: string | number] }>()

const editing = ref(false)
const draft = ref<string | number>(props.modelValue)
const input = ref<HTMLInputElement | null>(null)

const start = async () => {
  draft.value = props.modelValue
  editing.value = true
  await nextTick()
  input.value?.focus()
  input.value?.select()
}

const commit = () => {
  if (!editing.value) return
  editing.value = false
  const value = props.type === 'number' ? Number(draft.value) : String(draft.value).trim()
  if (value === props.modelValue || (props.type === 'number' && Number.isNaN(value)) || value === '') return
  emit('save', value)
}
const cancel = () => (editing.value = false)
</script>

<template>
  <span v-if="!editable"><slot>{{ modelValue }}</slot></span>
  <input
    v-else-if="editing"
    ref="input"
    v-model="draft"
    :type="type"
    :min="min"
    :step="step"
    class="rounded-lg border border-brand-500 bg-white px-2 py-0.5 text-ink shadow-ring outline-none"
    :class="inputClass ?? 'w-24'"
    @keydown.enter.prevent="commit"
    @keydown.esc.prevent="cancel"
    @blur="commit"
    @click.stop
  />
  <button
    v-else
    type="button"
    class="group/edit inline-flex items-center gap-1 rounded-lg px-1 -mx-1 text-left outline-dashed outline-1 outline-offset-2 outline-brand-300 transition hover:bg-brand-50"
    title="Cliquer pour modifier"
    @click.stop.prevent="start"
  >
    <slot>{{ modelValue }}</slot>
    <MIcon name="edit" :size="13" class="text-brand-500 opacity-60 group-hover/edit:opacity-100" />
  </button>
</template>
