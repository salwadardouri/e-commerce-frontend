<script setup lang="ts" generic="Row extends Record<string, any>">
import MSpinner from './MSpinner.vue'

export interface Column {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  /** extra classes on header + cells (widths, hiding on mobile…) */
  class?: string
}

const props = withDefaults(defineProps<{ columns: Column[]; rows: Row[]; rowKey?: string; loading?: boolean; clickable?: boolean }>(), {
  rowKey: 'id',
})

const emit = defineEmits<{ 'row-click': [row: Row] }>()
const align = (c: Column) => (c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left')
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-surface-line bg-surface">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-surface-muted text-xs uppercase tracking-wide text-ink-faint">
          <tr>
            <th v-for="c in columns" :key="c.key" scope="col" class="px-4 py-3 font-semibold" :class="[align(c), c.class]">{{ c.label }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-line">
          <tr
            v-for="row in rows"
            :key="row[props.rowKey]"
            class="transition hover:bg-surface-muted/70"
            :class="clickable && 'cursor-pointer'"
            @click="clickable && emit('row-click', row)"
          >
            <td v-for="c in columns" :key="c.key" class="px-4 py-3 align-middle" :class="[align(c), c.class]">
              <slot :name="`cell-${c.key}`" :row="row" :value="row[c.key]">{{ row[c.key] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="loading" class="flex items-center justify-center gap-2 p-8 text-ink-faint"><MSpinner /> Chargement…</div>
    <div v-else-if="!rows.length" class="p-8 text-center text-sm text-ink-faint"><slot name="empty">Aucune donnée.</slot></div>
  </div>
</template>
