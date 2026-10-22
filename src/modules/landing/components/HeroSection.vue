<script setup lang="ts">
import { computed } from 'vue'
import MButton from '@/components/generic/MButton.vue'
import MIcon from '@/components/generic/MIcon.vue'
import { assetUrl, formatPrice } from '@/lib/format'
import { SITE } from '@/lib/site'
import type { Product } from '@/types/models'

const props = defineProps<{ products: Product[]; productCount: number; categoryCount: number }>()
defineEmits<{ shop: []; categories: [] }>()

/** Up to 3 available products with a picture float next to the headline. */
const featured = computed(() => props.products.filter((p) => p.inStock && p.coverImage).slice(0, 3))
const POSITIONS = ['left-0 top-6 -rotate-6', 'right-2 top-0 rotate-3', 'left-16 bottom-0 rotate-2'] as const
</script>

<template>
  <section class="relative overflow-hidden bg-aurora">
    <div class="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
      <div class="animate-fade-up">
        <span class="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-brand-700 backdrop-blur">
          <MIcon name="sparkles" :size="14" /> Nouvelle collection disponible
        </span>
        <h1 class="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Trouvez ce qui vous
          <span class="text-gradient">ressemble</span>.
        </h1>
        <p class="mt-5 max-w-lg text-lg text-ink-soft">{{ SITE.tagline }}</p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <MButton size="lg" @click="$emit('shop')">
            Découvrir la boutique
            <template #trailing><MIcon name="arrow-right" :size="18" /></template>
          </MButton>
          <MButton size="lg" variant="secondary" @click="$emit('categories')">Voir les catégories</MButton>
        </div>
        <dl class="mt-10 flex gap-8 text-sm">
          <div>
            <dt class="text-ink-faint">Produits</dt>
            <dd class="font-display text-2xl font-extrabold">{{ productCount }}</dd>
          </div>
          <div>
            <dt class="text-ink-faint">Catégories</dt>
            <dd class="font-display text-2xl font-extrabold">{{ categoryCount }}</dd>
          </div>
          <div>
            <dt class="text-ink-faint">Livraison</dt>
            <dd class="font-display text-2xl font-extrabold">48 h</dd>
          </div>
        </dl>
      </div>

      <div class="relative mx-auto hidden h-[26rem] w-full max-w-md lg:block" aria-hidden="true">
        <div class="absolute inset-8 rounded-[2.5rem] bg-brand-gradient opacity-20 blur-3xl" />
        <div
          v-for="(p, i) in featured"
          :key="p.id"
          class="absolute w-56 animate-float rounded-2xl border border-white/70 bg-white/80 p-2.5 shadow-lift backdrop-blur-xl"
          :class="POSITIONS[i]"
          :style="{ animationDelay: `${i * 0.8}s` }"
        >
          <img :src="assetUrl(p.coverImage)" alt="" class="aspect-square w-full rounded-xl object-cover" />
          <div class="mt-2 flex items-center justify-between px-1 text-sm">
            <span class="truncate font-semibold">{{ p.name }}</span>
            <span class="font-bold text-brand-600">{{ formatPrice(p.price) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
