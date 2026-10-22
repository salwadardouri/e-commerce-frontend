<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import MButton from '@/components/generic/MButton.vue'
import MImageUpload from '@/components/generic/MImageUpload.vue'
import MInput from '@/components/generic/MInput.vue'
import MSelect from '@/components/generic/MSelect.vue'
import MSwitch from '@/components/generic/MSwitch.vue'
import MTextarea from '@/components/generic/MTextarea.vue'
import { fieldError } from '@/lib/errors'
import { useUploads } from '@/modules/uploads/uploads.hook'
import type { Product } from '@/types/models'
import { useCatalog } from '../catalog.hook'
import { useProducts } from '../products.hook'

const props = defineProps<{ product?: Product | null; defaultCategoryId?: number }>()
const emit = defineEmits<{ saved: [product: Product]; cancel: [] }>()

const catalog = useCatalog()
const { create, update } = useProducts()
const { uploadImage } = useUploads()

const form = reactive({
  name: '',
  description: '',
  categoryId: '' as number | '',
  price: 0 as number | null,
  stock: 0 as number | null,
  images: [] as string[],
  isActive: true,
})

watch(
  () => props.product,
  (p) =>
    Object.assign(form, {
      name: p?.name ?? '',
      description: p?.description ?? '',
      categoryId: p?.categoryId ?? props.defaultCategoryId ?? '',
      price: p?.price ?? 0,
      stock: p?.stock ?? 0,
      images: p?.images.map((i) => i.url) ?? [],
      isActive: p?.isActive ?? true,
    }),
  { immediate: true },
)

const categoryOptions = computed(() => catalog.categories.value.map((c) => ({ value: c.id, label: c.name })))
const action = () => (props.product ? update : create)
const error = () => action().error.value

const submit = async () => {
  const payload = {
    name: form.name,
    description: form.description,
    categoryId: form.categoryId === '' ? undefined : form.categoryId,
    price: Number(form.price ?? 0),
    stock: Number(form.stock ?? 0),
    images: form.images,
    isActive: form.isActive,
  }
  const saved = props.product ? await update.run(props.product.id, payload) : await create.run(payload)
  if (saved) emit('saved', saved)
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="submit">
    <MInput v-model="form.name" label="Nom du produit" required :error="fieldError(error(), 'name')" />
    <MSelect v-model="form.categoryId" label="Catégorie" :options="categoryOptions" placeholder="Choisir une catégorie" required :error="fieldError(error(), 'categoryId')" />

    <div class="grid gap-5 sm:grid-cols-2">
      <MInput v-model="form.price" label="Prix (€)" type="number" min="0" step="0.01" required :error="fieldError(error(), 'price')" />
      <MInput
        v-model="form.stock"
        label="Stock restant"
        type="number"
        min="0"
        step="1"
        required
        :hint="product ? `${product.sold ?? 0} vendu(s) · ${product.totalQuantity ?? 0} au total` : undefined"
        :error="fieldError(error(), 'stock')"
      />
    </div>

    <MTextarea v-model="form.description" label="Description" :rows="4" :error="fieldError(error(), 'description')" />
    <MImageUpload v-model="form.images" label="Images (la première est la couverture)" multiple :upload="(f) => uploadImage.run(f)" />
    <MSwitch v-model="form.isActive" label="Visible sur la boutique" />

    <div class="flex justify-end gap-2 pt-2">
      <MButton variant="ghost" @click="emit('cancel')">Annuler</MButton>
      <MButton type="submit" :loading="action().loading.value">{{ product ? 'Enregistrer' : 'Créer le produit' }}</MButton>
    </div>
  </form>
</template>
