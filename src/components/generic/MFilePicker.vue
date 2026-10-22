<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{ accept?: string; multiple?: boolean; disabled?: boolean }>(), {
  accept: 'image/png,image/jpeg,image/webp,image/gif,image/avif',
})

const emit = defineEmits<{ select: [files: File[]] }>()
const input = ref<HTMLInputElement | null>(null)

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  if (files.length) emit('select', files)
  target.value = '' // allow picking the same file again
}

defineExpose({ open: () => input.value?.click() })
</script>

<template>
  <!-- Any trigger (button, overlay, dropzone) goes in the slot -->
  <span class="contents" @click.stop.prevent="!disabled && input?.click()">
    <slot :open="() => input?.click()" />
    <input ref="input" type="file" class="hidden" :accept="accept" :multiple="multiple" :disabled="disabled" @change="onChange" @click.stop />
  </span>
</template>
