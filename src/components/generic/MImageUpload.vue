<script setup lang="ts">
import { ref } from 'vue'
import { assetUrl } from '@/lib/format'
import MFilePicker from './MFilePicker.vue'
import MIcon from './MIcon.vue'
import MSpinner from './MSpinner.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    /** Uploads one file and resolves with its URL. Provided by the parent (generic: no API knowledge here). */
    upload: (file: File) => Promise<string | undefined>
    multiple?: boolean
    max?: number
  }>(),
  { max: 10 },
)

/** Ordered list of image URLs. The first one is the cover. */
const model = defineModel<string[]>({ default: () => [] })
const busy = ref(false)

const onSelect = async (files: File[]) => {
  busy.value = true
  const urls: string[] = []
  for (const file of files.slice(0, Math.max(props.max - model.value.length, 0))) {
    const url = await props.upload(file)
    if (url) urls.push(url)
  }
  model.value = props.multiple ? [...model.value, ...urls] : urls.slice(0, 1)
  busy.value = false
}

const remove = (url: string) => (model.value = model.value.filter((u) => u !== url))
const makeCover = (url: string) => (model.value = [url, ...model.value.filter((u) => u !== url)])
</script>

<template>
  <div>
    <p v-if="label" class="mb-1.5 text-sm font-medium text-ink">{{ label }}</p>
    <ul class="grid grid-cols-3 gap-3 sm:grid-cols-4">
      <li v-for="(url, i) in model" :key="url" class="group relative aspect-square overflow-hidden rounded-xl border border-surface-line bg-surface-sunken">
        <img :src="assetUrl(url)" alt="" class="h-full w-full object-cover" loading="lazy" />
        <span v-if="i === 0 && multiple" class="absolute left-1.5 top-1.5 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">Couverture</span>
        <div class="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-ink/60 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
          <button v-if="multiple && i > 0" type="button" class="rounded-md bg-white/90 px-1.5 py-1 text-[10px] font-semibold text-ink" @click="makeCover(url)">Couverture</button>
          <span v-else />
          <button type="button" class="rounded-md bg-white/90 p-1 text-danger-600" aria-label="Retirer l'image" @click="remove(url)"><MIcon name="trash" :size="14" /></button>
        </div>
      </li>
      <li v-if="multiple ? model.length < max : !model.length">
        <MFilePicker :multiple="multiple" :disabled="busy" @select="onSelect">
          <button
            type="button"
            class="grid aspect-square w-full place-items-center rounded-xl border-2 border-dashed border-surface-line text-ink-faint transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
          >
            <span class="flex flex-col items-center gap-1 text-xs font-medium">
              <MSpinner v-if="busy" :size="22" />
              <MIcon v-else name="upload" :size="22" />
              {{ busy ? 'Envoi…' : 'Ajouter' }}
            </span>
          </button>
        </MFilePicker>
      </li>
    </ul>
  </div>
</template>
