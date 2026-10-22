<script setup lang="ts">
import MIcon from './MIcon.vue'

withDefaults(defineProps<{ icon?: string; title: string; description?: string }>(), { icon: 'package' })
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div class="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand-600">
      <slot name="icon"><MIcon :name="icon" :size="28" /></slot>
    </div>
    <h3 class="text-lg font-bold">{{ title }}</h3>
    <p v-if="description" class="mt-1 max-w-sm text-sm text-ink-soft">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5"><slot /></div>
  </div>
</template>
