<script setup lang="ts">
import { computed } from 'vue'
import MBadge from '@/components/generic/MBadge.vue'
import MButton from '@/components/generic/MButton.vue'
import MFilePicker from '@/components/generic/MFilePicker.vue'
import MIcon from '@/components/generic/MIcon.vue'
import MInlineEdit from '@/components/generic/MInlineEdit.vue'
import { assetUrl, formatPrice } from '@/lib/format'
import { SITE } from '@/lib/site'
import type { Product } from '@/types/models'

const props = defineProps<{
  product: Product
  /** Admin in-place editing */
  editable?: boolean
  /** Units of this product already in the cart */
  inCart?: number
  busy?: boolean
}>()

const emit = defineEmits<{
  add: [product: Product]
  'update-price': [product: Product, price: number]
  'update-stock': [product: Product, stock: number]
  'replace-image': [product: Product, file: File]
  'toggle-active': [product: Product]
}>()

const outOfStock = computed(() => props.product.stock <= 0)
const lowStock = computed(() => !outOfStock.value && props.product.stock <= SITE.lowStockThreshold)
const reachedMax = computed(() => (props.inCart ?? 0) >= props.product.stock)
</script>

<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-line bg-surface shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    :class="[!product.isActive && 'opacity-70', editable && 'ring-1 ring-brand-200']"
  >
    <div class="relative aspect-square overflow-hidden bg-surface-sunken">
      <img
        v-if="product.coverImage"
        :src="assetUrl(product.coverImage)"
        :alt="product.name"
        width="600"
        height="600"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        :class="outOfStock && 'grayscale'"
      />
      <div v-else class="grid h-full w-full place-items-center text-ink-faint"><MIcon name="image" :size="40" /></div>

      <div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">
        <MBadge v-if="outOfStock" tone="danger" dot>Rupture de stock</MBadge>
        <MBadge v-else-if="lowStock" tone="warning" dot>Plus que {{ product.stock }}</MBadge>
        <MBadge v-if="!product.isActive" tone="neutral">Masqué</MBadge>
      </div>

      <template v-if="editable">
        <span class="prod-handle absolute right-3 top-3 grid h-8 w-8 cursor-grab place-items-center rounded-lg bg-white/90 text-ink-soft shadow active:cursor-grabbing" title="Glisser pour déplacer">
          <MIcon name="grip" :size="16" />
        </span>
        <div class="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <MFilePicker @select="(files) => emit('replace-image', product, files[0]!)">
            <button type="button" :disabled="busy" class="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-ink shadow transition hover:bg-brand-50 hover:text-brand-700">
              <MIcon name="image" :size="14" /> Changer l’image
            </button>
          </MFilePicker>
          <button
            type="button"
            class="grid h-8 w-8 place-items-center rounded-lg bg-white/95 text-ink-soft shadow transition hover:text-brand-700"
            :title="product.isActive ? 'Masquer ce produit' : 'Afficher ce produit'"
            @click="emit('toggle-active', product)"
          >
            <MIcon :name="product.isActive ? 'eye' : 'eye-off'" :size="16" />
          </button>
        </div>
      </template>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div>
        <h3 class="text-base font-bold leading-snug">{{ product.name }}</h3>
        <p v-if="product.description" class="mt-1 line-clamp-2 text-sm text-ink-soft">{{ product.description }}</p>
      </div>

      <div class="mt-auto flex items-end justify-between gap-2">
        <MInlineEdit
          :model-value="product.price"
          type="number"
          :min="0"
          :step="0.01"
          :editable="editable"
          @save="(v) => emit('update-price', product, Number(v))"
        >
          <span class="font-display text-xl font-extrabold">{{ formatPrice(product.price) }}</span>
        </MInlineEdit>

        <span v-if="editable" class="text-xs text-ink-soft">
          Stock :
          <MInlineEdit :model-value="product.stock" type="number" :min="0" editable input-class="w-16" @save="(v) => emit('update-stock', product, Number(v))" />
        </span>
      </div>

      <MButton
        :variant="outOfStock ? 'secondary' : 'primary'"
        block
        :disabled="outOfStock || reachedMax"
        @click="emit('add', product)"
      >
        <template v-if="!outOfStock" #leading><MIcon name="cart" :size="16" /></template>
        {{ outOfStock ? 'Rupture de stock' : reachedMax ? 'Quantité maximale' : 'Ajouter au panier' }}
      </MButton>
    </div>
  </article>
</template>
