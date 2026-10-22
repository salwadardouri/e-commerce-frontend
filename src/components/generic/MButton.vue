<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import MSpinner from './MSpinner.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'dark'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    block?: boolean
    /** Square button meant to hold a single icon */
    icon?: boolean
    /** Renders a router link instead of a <button> */
    to?: RouteLocationRaw
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const VARIANTS = {
  primary: 'bg-brand-gradient text-white shadow-glow hover:brightness-110 active:brightness-95',
  secondary: 'border border-surface-line bg-surface text-ink hover:border-brand-300 hover:bg-brand-50',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  ghost: 'text-ink-soft hover:bg-surface-sunken hover:text-ink',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
  dark: 'bg-ink text-white hover:bg-brand-900',
} as const

const SIZES = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-sm',
  md: 'h-10 gap-2 rounded-xl px-4 text-sm',
  lg: 'h-12 gap-2 rounded-xl px-6 text-base',
} as const

const classes = computed(() => [
  'inline-flex select-none items-center justify-center whitespace-nowrap font-semibold transition duration-150',
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
  VARIANTS[props.variant],
  SIZES[props.size],
  props.icon && (props.size === 'sm' ? '!w-8 !px-0' : props.size === 'lg' ? '!w-12 !px-0' : '!w-10 !px-0'),
  props.block && 'w-full',
])

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    v-bind="to ? { to } : { type, disabled: isDisabled }"
    :class="classes"
    :aria-busy="loading || undefined"
    @click="emit('click', $event)"
  >
    <MSpinner v-if="loading" :size="16" />
    <slot v-else name="leading" />
    <slot />
    <slot name="trailing" />
  </component>
</template>
