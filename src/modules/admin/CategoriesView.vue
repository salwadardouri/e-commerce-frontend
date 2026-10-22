<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MBadge from '@/components/generic/MBadge.vue'
import MButton from '@/components/generic/MButton.vue'
import MIcon from '@/components/generic/MIcon.vue'
import MModal from '@/components/generic/MModal.vue'
import MTable, { type Column } from '@/components/generic/MTable.vue'
import { useConfirm } from '@/composables/useConfirm'
import { assetUrl } from '@/lib/format'
import { useCatalog } from '@/modules/catalog/catalog.hook'
import { useCategories } from '@/modules/catalog/categories.hook'
import CategoryForm from '@/modules/catalog/components/CategoryForm.vue'
import type { Category } from '@/types/models'

const catalog = useCatalog()
const { remove, update } = useCategories()
const { confirm } = useConfirm()

const modalOpen = ref(false)
const editing = ref<Category | null>(null)

const COLUMNS: Column[] = [
  { key: 'name', label: 'Catégorie' },
  { key: 'products', label: 'Produits', align: 'center', class: 'hidden sm:table-cell' },
  { key: 'isActive', label: 'Statut', class: 'hidden sm:table-cell' },
  { key: 'actions', label: '', align: 'right' },
]

onMounted(() => void catalog.load(true))

const openCreate = () => {
  editing.value = null
  modalOpen.value = true
}
const openEdit = (c: Category) => {
  editing.value = c
  modalOpen.value = true
}

const askDelete = async (c: Category & { products: unknown[] }) => {
  const ok = await confirm({
    title: `Supprimer « ${c.name} » ?`,
    message: c.products.length ? 'Cette catégorie contient des produits : déplacez-les ou supprimez-les d’abord.' : 'Cette action est définitive.',
    confirmLabel: 'Supprimer',
  })
  if (ok) await remove.run(c.id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold sm:text-3xl">Catégories</h1>
        <p class="text-sm text-ink-soft">Réordonnez-les par glisser-déposer depuis « Page d’accueil ».</p>
      </div>
      <MButton @click="openCreate"><template #leading><MIcon name="plus" :size="16" /></template>Nouvelle catégorie</MButton>
    </div>

    <MTable :columns="COLUMNS" :rows="catalog.categories.value" :loading="catalog.loading.value && !catalog.loaded.value">
      <template #empty>Aucune catégorie. Créez la première pour commencer.</template>
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <img v-if="row.image" :src="assetUrl(row.image)" alt="" class="h-12 w-12 rounded-xl object-cover" loading="lazy" />
          <span v-else class="grid h-12 w-12 place-items-center rounded-xl bg-surface-sunken text-ink-faint"><MIcon name="image" /></span>
          <div class="min-w-0">
            <p class="truncate font-semibold">{{ row.name }}</p>
            <p class="truncate text-xs text-ink-faint">/{{ row.slug }}</p>
          </div>
        </div>
      </template>
      <template #cell-products="{ row }">{{ row.products.length }}</template>
      <template #cell-isActive="{ row }"><MBadge :tone="row.isActive ? 'success' : 'neutral'" dot>{{ row.isActive ? 'Visible' : 'Masquée' }}</MBadge></template>
      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-1">
          <MButton variant="ghost" size="sm" icon :title="row.isActive ? 'Masquer' : 'Afficher'" :aria-label="row.isActive ? 'Masquer' : 'Afficher'" @click="update.run(row.id, { isActive: !row.isActive })"><MIcon :name="row.isActive ? 'eye' : 'eye-off'" :size="16" /></MButton>
          <MButton variant="ghost" size="sm" icon aria-label="Modifier" @click="openEdit(row)"><MIcon name="edit" :size="16" /></MButton>
          <MButton variant="ghost" size="sm" icon aria-label="Supprimer" class="hover:!text-danger-600" @click="askDelete(row)"><MIcon name="trash" :size="16" /></MButton>
        </div>
      </template>
    </MTable>

    <MModal v-model="modalOpen" :title="editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'">
      <CategoryForm :category="editing" @saved="modalOpen = false" @cancel="modalOpen = false" />
    </MModal>
  </div>
</template>
