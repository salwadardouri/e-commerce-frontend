<script setup lang="ts">
import draggable from 'vuedraggable'
import MBadge from '@/components/generic/MBadge.vue'
import MIcon from '@/components/generic/MIcon.vue'
import ProductCard from './ProductCard.vue'
import type { CategoryWithProducts, Product } from '@/types/models'

defineProps<{
  category: CategoryWithProducts
  products: Product[]
  editable?: boolean
  /** Dragging is disabled while a search filter is active (the list would be partial) */
  canDrag?: boolean
  busyProductId?: number | null
  cartQuantity: (productId: number) => number
}>()

const emit = defineEmits<{
  'update:products': [products: Product[]]
  'products-change': [event: Record<string, unknown>]
  add: [product: Product]
  'update-price': [product: Product, price: number]
  'update-stock': [product: Product, stock: number]
  'replace-image': [product: Product, file: File]
  'toggle-active': [product: Product]
}>()
</script>

<template>
  <section :id="`cat-${category.slug}`" class="scroll-mt-24" :aria-labelledby="`title-${category.id}`">
    <header class="mb-5 flex items-end justify-between gap-3">
      <div class="flex items-center gap-3">
        <span v-if="editable && canDrag" class="cat-handle grid h-9 w-9 cursor-grab place-items-center rounded-xl bg-surface-sunken text-ink-soft active:cursor-grabbing" title="Glisser pour réordonner la catégorie">
          <MIcon name="grip" :size="18" />
        </span>
        <div>
          <h2 :id="`title-${category.id}`" class="text-2xl font-extrabold sm:text-3xl">{{ category.name }}</h2>
          <p v-if="category.description" class="mt-0.5 text-sm text-ink-soft">{{ category.description }}</p>
        </div>
      </div>
      <MBadge v-if="!category.isActive" tone="neutral">Masquée</MBadge>
    </header>

    <draggable
      :model-value="products"
      item-key="id"
      group="products"
      handle=".prod-handle"
      :disabled="!editable || !canDrag"
      :animation="220"
      ghost-class="drag-ghost"
      chosen-class="drag-chosen"
      class="grid min-h-28 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      @update:model-value="emit('update:products', $event)"
      @change="emit('products-change', $event)"
    >
      <template #item="{ element }">
        <ProductCard
          :product="element"
          :editable="editable"
          :in-cart="cartQuantity(element.id)"
          :busy="busyProductId === element.id"
          @add="emit('add', $event)"
          @update-price="(p, v) => emit('update-price', p, v)"
          @update-stock="(p, v) => emit('update-stock', p, v)"
          @replace-image="(p, f) => emit('replace-image', p, f)"
          @toggle-active="emit('toggle-active', $event)"
        />
      </template>
      <template v-if="editable && !products.length" #footer>
        <div class="col-span-full grid place-items-center rounded-2xl border-2 border-dashed border-surface-line p-8 text-sm text-ink-faint">
          Glissez un produit ici
        </div>
      </template>
    </draggable>
  </section>
</template>
