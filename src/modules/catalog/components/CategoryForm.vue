<script setup lang="ts">
import { reactive, watch } from 'vue'
import MButton from '@/components/generic/MButton.vue'
import MImageUpload from '@/components/generic/MImageUpload.vue'
import MInput from '@/components/generic/MInput.vue'
import MSwitch from '@/components/generic/MSwitch.vue'
import MTextarea from '@/components/generic/MTextarea.vue'
import { fieldError } from '@/lib/errors'
import { useUploads } from '@/modules/uploads/uploads.hook'
import type { Category } from '@/types/models'
import { useCategories } from '../categories.hook'

const props = defineProps<{ category?: Category | null }>()
const emit = defineEmits<{ saved: [category: Category]; cancel: [] }>()

const { create, update } = useCategories()
const { uploadImage } = useUploads()

const form = reactive({ name: '', description: '', images: [] as string[], isActive: true })

watch(
  () => props.category,
  (c) => Object.assign(form, { name: c?.name ?? '', description: c?.description ?? '', images: c?.image ? [c.image] : [], isActive: c?.isActive ?? true }),
  { immediate: true },
)

const action = () => (props.category ? update : create)
const error = () => action().error.value

const submit = async () => {
  const payload = { name: form.name, description: form.description, image: form.images[0] ?? '', isActive: form.isActive }
  const saved = props.category ? await update.run(props.category.id, payload) : await create.run(payload)
  if (saved) emit('saved', saved)
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="submit">
    <MInput v-model="form.name" label="Nom de la catégorie" required :error="fieldError(error(), 'name')" />
    <MTextarea v-model="form.description" label="Description" :rows="3" :error="fieldError(error(), 'description')" />
    <MImageUpload v-model="form.images" label="Image" :upload="(f) => uploadImage.run(f)" />
    <MSwitch v-model="form.isActive" label="Visible sur la boutique" />

    <div class="flex justify-end gap-2 pt-2">
      <MButton variant="ghost" @click="emit('cancel')">Annuler</MButton>
      <MButton type="submit" :loading="action().loading.value">{{ category ? 'Enregistrer' : 'Créer la catégorie' }}</MButton>
    </div>
  </form>
</template>
