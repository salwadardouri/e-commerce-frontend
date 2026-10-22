<script setup lang="ts">
import MFilePicker from '@/components/generic/MFilePicker.vue'
import MIcon from '@/components/generic/MIcon.vue'
import { assetUrl } from '@/lib/format'
import type { CategoryWithProducts } from '@/types/models'

defineProps<{ categories: CategoryWithProducts[]; editable?: boolean }>()
const emit = defineEmits<{ 'replace-image': [category: CategoryWithProducts, file: File] }>()
</script>

<template>
  <section class="container-page py-14" aria-label="Catégories">
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-extrabold sm:text-4xl">Explorer par catégorie</h2>
      <p class="mt-2 text-ink-soft">Une sélection pour chaque envie.</p>
    </div>
    <ul class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      <li v-for="c in categories" :key="c.id">
        <a
          :href="`#cat-${c.slug}`"
          class="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-surface-sunken shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <img v-if="c.image" :src="assetUrl(c.image)" :alt="c.name" loading="lazy" decoding="async" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <h3 class="text-lg font-bold sm:text-xl">{{ c.name }}</h3>
            <p class="text-xs text-white/80 sm:text-sm">{{ c.products.length }} produit{{ c.products.length > 1 ? 's' : '' }}</p>
          </div>
          <MFilePicker v-if="editable" @select="(files) => emit('replace-image', c, files[0]!)">
            <button type="button" class="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-ink shadow hover:bg-brand-50 hover:text-brand-700">
              <MIcon name="image" :size="14" /> Image
            </button>
          </MFilePicker>
        </a>
      </li>
    </ul>
  </section>
</template>
