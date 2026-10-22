<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MBadge from '@/components/generic/MBadge.vue'
import MButton from '@/components/generic/MButton.vue'
import MIcon from '@/components/generic/MIcon.vue'
import MModal from '@/components/generic/MModal.vue'
import MSearch from '@/components/generic/MSearch.vue'
import MSelect from '@/components/generic/MSelect.vue'
import MStatCard from '@/components/generic/MStatCard.vue'
import MTable, { type Column } from '@/components/generic/MTable.vue'
import { useConfirm } from '@/composables/useConfirm'
import { assetUrl, formatPrice } from '@/lib/format'
import { useCatalog } from '@/modules/catalog/catalog.hook'
import ProductForm from '@/modules/catalog/components/ProductForm.vue'
import { useProducts } from '@/modules/catalog/products.hook'
import type { Product } from '@/types/models'

const catalog = useCatalog()
const { remove, update } = useProducts()
const { confirm } = useConfirm()

const query = ref('')
const categoryFilter = ref<number | ''>('')
const modalOpen = ref(false)
const editing = ref<Product | null>(null)

onMounted(() => void catalog.load(true))

const rows = computed(() => {
  const q = query.value.trim().toLowerCase()
  return catalog.products.value.filter(
    (p) => (categoryFilter.value === '' || p.categoryId === categoryFilter.value) && (!q || p.name.toLowerCase().includes(q)),
  )
})
const categoryName = (id: number) => catalog.categoryById(id)?.name ?? '—'
const categoryOptions = computed(() => catalog.categories.value.map((c) => ({ value: c.id, label: c.name })))

const totals = computed(() => ({
  count: catalog.products.value.length,
  remaining: catalog.products.value.reduce((n, p) => n + p.stock, 0),
  sold: catalog.products.value.reduce((n, p) => n + (p.sold ?? 0), 0),
  out: catalog.products.value.filter((p) => p.stock === 0).length,
}))

const COLUMNS: Column[] = [
  { key: 'name', label: 'Produit' },
  { key: 'category', label: 'Catégorie', class: 'hidden md:table-cell' },
  { key: 'price', label: 'Prix', align: 'right' },
  { key: 'stock', label: 'Stock restant', align: 'center' },
  { key: 'sold', label: 'Vendus', align: 'center', class: 'hidden lg:table-cell' },
  { key: 'isActive', label: 'Statut', class: 'hidden sm:table-cell' },
  { key: 'actions', label: '', align: 'right' },
]

const openCreate = () => {
  editing.value = null
  modalOpen.value = true
}
const openEdit = (p: Product) => {
  editing.value = p
  modalOpen.value = true
}
const askDelete = async (p: Product) => {
  if (await confirm({ title: `Supprimer « ${p.name} » ?`, message: 'Le produit disparaîtra de la boutique. L’historique des commandes est conservé.', confirmLabel: 'Supprimer' })) {
    await remove.run(p.id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold sm:text-3xl">Produits</h1>
        <p class="text-sm text-ink-soft">Stock, prix et visibilité de votre catalogue.</p>
      </div>
      <MButton :disabled="!catalog.categories.value.length" @click="openCreate"><template #leading><MIcon name="plus" :size="16" /></template>Nouveau produit</MButton>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MStatCard label="Nombre de produits" :value="totals.count" icon="tag" />
      <MStatCard label="Unités restantes" :value="totals.remaining" icon="package" tone="mint" />
      <MStatCard label="Unités vendues" :value="totals.sold" icon="zap" tone="accent" />
      <MStatCard label="Hors stock" :value="totals.out" icon="alert" tone="sun" />
    </div>

    <div class="grid gap-3 sm:grid-cols-[1fr_14rem]">
      <MSearch v-model="query" placeholder="Rechercher un produit…" />
      <MSelect v-model="categoryFilter" :options="categoryOptions" placeholder="Toutes les catégories" />
    </div>

    <MTable :columns="COLUMNS" :rows="rows" :loading="catalog.loading.value && !catalog.loaded.value">
      <template #empty>{{ catalog.categories.value.length ? 'Aucun produit trouvé.' : 'Créez d’abord une catégorie.' }}</template>
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <img v-if="row.coverImage" :src="assetUrl(row.coverImage)" alt="" class="h-12 w-12 rounded-xl object-cover" loading="lazy" />
          <span v-else class="grid h-12 w-12 place-items-center rounded-xl bg-surface-sunken text-ink-faint"><MIcon name="image" /></span>
          <p class="max-w-[14rem] truncate font-semibold">{{ row.name }}</p>
        </div>
      </template>
      <template #cell-category="{ row }">{{ categoryName(row.categoryId) }}</template>
      <template #cell-price="{ row }"><span class="font-semibold tabular-nums">{{ formatPrice(row.price) }}</span></template>
      <template #cell-stock="{ row }">
        <MBadge :tone="row.stock === 0 ? 'danger' : row.stock <= 5 ? 'warning' : 'success'" dot>{{ row.stock === 0 ? 'Rupture' : row.stock }}</MBadge>
      </template>
      <template #cell-sold="{ row }">{{ row.sold ?? 0 }}</template>
      <template #cell-isActive="{ row }"><MBadge :tone="row.isActive ? 'success' : 'neutral'">{{ row.isActive ? 'Visible' : 'Masqué' }}</MBadge></template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-1">
          <MButton variant="ghost" size="sm" icon :aria-label="row.isActive ? 'Masquer' : 'Afficher'" :title="row.isActive ? 'Masquer' : 'Afficher'" @click="update.run(row.id, { isActive: !row.isActive })"><MIcon :name="row.isActive ? 'eye' : 'eye-off'" :size="16" /></MButton>
          <MButton variant="ghost" size="sm" icon aria-label="Modifier" @click="openEdit(row)"><MIcon name="edit" :size="16" /></MButton>
          <MButton variant="ghost" size="sm" icon aria-label="Supprimer" class="hover:!text-danger-600" @click="askDelete(row)"><MIcon name="trash" :size="16" /></MButton>
        </div>
      </template>
    </MTable>

    <MModal v-model="modalOpen" :title="editing ? 'Modifier le produit' : 'Nouveau produit'" size="lg">
      <ProductForm :product="editing" :default-category-id="categoryFilter || undefined" @saved="modalOpen = false" @cancel="modalOpen = false" />
    </MModal>
  </div>
</template>
