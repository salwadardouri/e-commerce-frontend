import { useApi } from '@/composables/useApi'
import { useAsyncAction } from '@/composables/useAsyncAction'
import type { Category, CategoryPayload } from '@/types/models'
import { useCatalog } from './catalog.hook'

/** Category CRUD + ordering. Every successful call also updates the shared catalog state. */
export function useCategories() {
  const api = useApi()
  const catalog = useCatalog()

  const create = useAsyncAction(
    async (payload: CategoryPayload) => {
      const category = await api.post<Category>('/categories', payload)
      catalog.upsertCategory(category)
      return category
    },
    { success: 'Catégorie créée' },
  )

  const update = useAsyncAction(
    async (id: number, payload: CategoryPayload) => {
      const category = await api.patch<Category>(`/categories/${id}`, payload)
      catalog.upsertCategory(category)
      return category
    },
    { success: 'Catégorie mise à jour' },
  )

  const remove = useAsyncAction(
    async (id: number) => {
      await api.remove(`/categories/${id}`)
      catalog.dropCategory(id)
    },
    { success: 'Catégorie supprimée' },
  )

  /** Drag & drop: state is already reordered by the UI; persist, and resync on failure. */
  const reorder = useAsyncAction(async (orderedIds: number[]) => {
    catalog.setCategoryOrder(orderedIds)
    try {
      await api.put('/categories/order', { ids: orderedIds })
    } catch (e) {
      await catalog.load(true)
      throw e
    }
  })

  return { categories: catalog.categories, create, update, remove, reorder }
}
