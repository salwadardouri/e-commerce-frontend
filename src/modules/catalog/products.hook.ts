import { useApi } from '@/composables/useApi'
import { useAsyncAction } from '@/composables/useAsyncAction'
import type { Product, ProductPayload } from '@/types/models'
import { useCatalog } from './catalog.hook'

/** Product CRUD + drag & drop ordering. Every successful call also updates the shared catalog state. */
export function useProducts() {
  const api = useApi()
  const catalog = useCatalog()

  const create = useAsyncAction(
    async (payload: ProductPayload) => {
      const product = await api.post<Product>('/products', payload)
      catalog.upsertProduct(product)
      return product
    },
    { success: 'Produit créé' },
  )

  const update = useAsyncAction(
    async (id: number, payload: ProductPayload) => {
      const product = await api.patch<Product>(`/products/${id}`, payload)
      catalog.upsertProduct(product)
      return product
    },
    { success: 'Produit mis à jour' },
  )

  const remove = useAsyncAction(
    async (id: number) => {
      await api.remove(`/products/${id}`)
      catalog.dropProduct(id)
    },
    { success: 'Produit supprimé' },
  )

  /**
   * Persists the order of a category after a drag & drop. The UI has already moved the cards
   * (optimistic); products dropped from another category are moved into this one by the API.
   */
  const reorderInCategory = useAsyncAction(async (categoryId: number, orderedIds: number[]) => {
    try {
      await api.put(`/categories/${categoryId}/products/order`, { ids: orderedIds })
    } catch (e) {
      await catalog.load(true)
      throw e
    }
  })

  return { products: catalog.products, create, update, remove, reorderInCategory }
}
