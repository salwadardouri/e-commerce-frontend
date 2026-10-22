<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import draggable from 'vuedraggable'
import MBar from '@/components/generic/MBar.vue'
import MButton from '@/components/generic/MButton.vue'
import MEmpty from '@/components/generic/MEmpty.vue'
import MIcon from '@/components/generic/MIcon.vue'
import { useToast } from '@/composables/useToast'
import { useAuth } from '@/modules/auth/auth.hook'
import { useCart } from '@/modules/cart/cart.hook'
import { useCatalog } from '@/modules/catalog/catalog.hook'
import { useCategories } from '@/modules/catalog/categories.hook'
import { useProducts } from '@/modules/catalog/products.hook'
import { useUploads } from '@/modules/uploads/uploads.hook'
import type { CategoryWithProducts, Product } from '@/types/models'
import CategorySection from './components/CategorySection.vue'
import CategoryShowcase from './components/CategoryShowcase.vue'
import FeaturesStrip from './components/FeaturesStrip.vue'
import HeroSection from './components/HeroSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import { useEditMode } from './useEditMode'

/** `forceEdit`: used inside the admin dashboard, where editing is always on. */
const props = defineProps<{ forceEdit?: boolean }>()

const toast = useToast()
const cart = useCart()
const { isAdmin } = useAuth()
const catalog = useCatalog()
const categoriesApi = useCategories()
const productsApi = useProducts()
const { uploadImage } = useUploads()
const edit = useEditMode()

const editable = computed(() => (props.forceEdit ? isAdmin.value : edit.editMode.value))
const query = ref('')
const search = computed(() => query.value.trim().toLowerCase())
const canDrag = computed(() => editable.value && !search.value)
const busyProductId = ref<number | null>(null)

onMounted(() => void catalog.load())

const matches = (p: Product) => !search.value || `${p.name} ${p.description ?? ''}`.toLowerCase().includes(search.value)
const productsOf = (c: CategoryWithProducts) => (search.value ? c.products.filter(matches) : c.products)
const isShown = (c: CategoryWithProducts) => (editable.value && !search.value ? true : c.isActive && productsOf(c).length > 0)

const publicCategories = computed(() => catalog.categories.value.filter((c) => c.isActive))
const allProducts = computed(() => publicCategories.value.flatMap((c) => c.products).filter((p) => p.isActive))
const noResults = computed(() => catalog.loaded.value && !catalog.categories.value.some(isShown))

// ---- visitor actions ----
const addToCart = (product: Product) => {
  if (cart.add(product)) toast.success(`« ${product.name} » ajouté au panier`)
  else toast.error('Stock maximal atteint pour ce produit.')
}

// ---- admin in-place edits ----
const updatePrice = (p: Product, price: number) => void productsApi.update.run(p.id, { price })
const updateStock = (p: Product, stock: number) => void productsApi.update.run(p.id, { stock })
const toggleActive = (p: Product) => void productsApi.update.run(p.id, { isActive: !p.isActive })

const replaceProductImage = async (p: Product, file: File) => {
  busyProductId.value = p.id
  const url = await uploadImage.run(file)
  if (url) await productsApi.update.run(p.id, { coverImage: url })
  busyProductId.value = null
}

const replaceCategoryImage = async (c: CategoryWithProducts, file: File) => {
  const url = await uploadImage.run(file)
  if (url) await categoriesApi.update.run(c.id, { image: url })
}

// ---- drag & drop ----
const onCategoriesUpdate = (list: CategoryWithProducts[]) => catalog.setCategoryOrder(list.map((c) => c.id))
const onCategoriesChange = (e: { moved?: unknown }) => {
  if (e.moved) void categoriesApi.reorder.run(catalog.categories.value.map((c) => c.id))
}

const onProductsUpdate = (category: CategoryWithProducts, list: Product[]) => catalog.setCategoryProducts(category.id, list)
const onProductsChange = (category: CategoryWithProducts, e: { added?: unknown; moved?: unknown }) => {
  // "removed" is covered by the destination list's "added" (the API moves the product).
  if (e.added || e.moved) {
    const ids = catalog.categoryById(category.id)?.products.map((p) => p.id) ?? []
    void productsApi.reorderInCategory.run(category.id, ids)
  }
}

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
</script>

<template>
  <div class="min-h-screen bg-surface">
    <MBar v-if="editable && !forceEdit" tone="dark">
      <span class="inline-flex items-center gap-2"><MIcon name="edit" :size="16" /> Mode édition : cliquez sur un prix, une image, ou glissez les cartes pour les réordonner.</span>
      <template #end><MButton size="sm" variant="secondary" @click="edit.set(false)">Terminer</MButton></template>
    </MBar>
    <MBar v-else-if="!forceEdit" tone="brand">Livraison offerte dès 80&nbsp;€ d’achat · Commandez en quelques clics</MBar>

    <SiteHeader v-model:query="query" :sticky="!forceEdit" />

    <main>
      <HeroSection
        :products="allProducts"
        :product-count="allProducts.length"
        :category-count="publicCategories.length"
        @shop="scrollTo('boutique')"
        @categories="scrollTo('categories')"
      />

      <div id="categories">
        <CategoryShowcase :categories="editable ? catalog.categories.value : publicCategories" :editable="editable" @replace-image="replaceCategoryImage" />
      </div>

      <div id="boutique" class="container-page space-y-16 pb-20 pt-4">
        <div v-if="!catalog.loaded.value && catalog.loading.value" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
          <div v-for="i in 8" :key="i" class="aspect-[3/4] animate-pulse rounded-2xl bg-surface-sunken" />
        </div>

        <MEmpty v-else-if="catalog.error.value" icon="alert" title="Impossible de charger la boutique" :description="catalog.error.value.message">
          <MButton @click="catalog.load(true)">Réessayer</MButton>
        </MEmpty>

        <MEmpty
          v-else-if="noResults"
          icon="search"
          :title="search ? 'Aucun résultat' : 'La boutique est vide pour le moment'"
          :description="search ? `Aucun produit ne correspond à « ${query} ».` : 'Revenez bientôt, de nouveaux produits arrivent.'"
        />

        <draggable
          v-else
          :model-value="catalog.categories.value"
          item-key="id"
          group="categories"
          handle=".cat-handle"
          :disabled="!canDrag"
          :animation="250"
          ghost-class="drag-ghost"
          class="space-y-16"
          @update:model-value="onCategoriesUpdate"
          @change="onCategoriesChange"
        >
          <template #item="{ element }">
            <div v-show="isShown(element)">
              <CategorySection
                :category="element"
                :products="productsOf(element)"
                :editable="editable"
                :can-drag="canDrag"
                :busy-product-id="busyProductId"
                :cart-quantity="cart.quantityOf"
                @update:products="onProductsUpdate(element, $event)"
                @products-change="onProductsChange(element, $event)"
                @add="addToCart"
                @update-price="(p, v) => updatePrice(p, v)"
                @update-stock="(p, v) => updateStock(p, v)"
                @replace-image="replaceProductImage"
                @toggle-active="toggleActive"
              />
            </div>
          </template>
        </draggable>
      </div>

      <FeaturesStrip />
    </main>

    <SiteFooter />

    <button
      v-if="isAdmin && !forceEdit && !editable"
      type="button"
      class="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-105"
      @click="edit.set(true)"
    >
      <MIcon name="edit" :size="16" /> Modifier la page
    </button>
  </div>
</template>
