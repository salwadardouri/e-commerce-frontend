<script setup lang="ts">
withDefaults(defineProps<{ sticky?: boolean; bordered?: boolean; contained?: boolean }>(), {
  sticky: true,
  bordered: true,
  contained: true,
})
</script>

<template>
  <header
    class="z-30 w-full bg-surface/80 backdrop-blur-xl"
    :class="[sticky && 'sticky top-0', bordered && 'border-b border-surface-line']"
  >
    <div class="flex h-16 items-center gap-4" :class="contained ? 'container-page' : 'px-4 sm:px-6'">
      <div class="flex shrink-0 items-center gap-2"><slot name="logo" /></div>
      <nav class="hidden flex-1 items-center gap-1 md:flex" aria-label="Navigation principale"><slot name="nav" /></nav>
      <div class="flex flex-1 items-center justify-end gap-2 md:flex-none"><slot name="actions" /></div>
    </div>
    <slot />
  </header>
</template>
