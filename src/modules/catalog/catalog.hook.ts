import { computed, ref, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAsyncAction } from '@/composables/useAsyncAction'
import { useAuth } from '@/modules/auth/auth.hook'
import type { Category, CategoryWithProducts, Product } from '@/types/models'

/**
 * Single source of truth for categories + products (landing page AND admin screens).
 * The API returns inactive items too when the visitor is an admin, hence the reload on login/logout.
 * Mutations from categories.hook / products.hook update this state in place — no refetch needed.
 */
const categories = ref<CategoryWithProducts[]>([])
const loaded = ref(false)

export function useCatalog() {
  const api = useApi()

  const fetchCatalog = useAsyncAction(
    async () => {
      categories.value = await api.get<CategoryWithProducts[]>('/catalog')
      loaded.value = true
    },
    { silent: true },
  )

  const load = (force = false) => (loaded.value && !force ? Promise.resolve() : fetchCatalog.run())

  const products = computed<Product[]>(() => categories.value.flatMap((c) => c.products))
  const categoryById = (id: number) => categories.value.find((c) => c.id === id)

  // ---- local state mutators (called after a successful API call) ----
  const upsertCategory = (category: Category | CategoryWithProducts) => {
    const existing = categoryById(category.id)
    if (existing) Object.assign(existing, { ...category, products: existing.products })
    else categories.value.push({ ...category, products: [] })
  }
  const dropCategory = (id: number) => {
    categories.value = categories.value.filter((c) => c.id !== id)
  }
  const setCategoryOrder = (orderedIds: number[]) => {
    const byId = new Map(categories.value.map((c) => [c.id, c]))
    categories.value = orderedIds.map((id) => byId.get(id)).filter((c): c is CategoryWithProducts => !!c)
  }

  const upsertProduct = (product: Product) => {
    for (const c of categories.value) c.products = c.products.filter((p) => p.id !== product.id || c.id === product.categoryId)
    const target = categoryById(product.categoryId)
    if (!target) return
    const index = target.products.findIndex((p) => p.id === product.id)
    if (index >= 0) target.products[index] = product
    else target.products.push(product)
  }
  const dropProduct = (id: number) => {
    for (const c of categories.value) c.products = c.products.filter((p) => p.id !== id)
  }
  const setCategoryProducts = (categoryId: number, list: Product[]) => {
    const target = categoryById(categoryId)
    if (!target) return
    target.products = list.map((p) => ({ ...p, categoryId }))
  }

  return {
    categories,
    products,
    loaded,
    loading: fetchCatalog.loading,
    error: fetchCatalog.error,
    load,
    categoryById,
    upsertCategory,
    dropCategory,
    setCategoryOrder,
    upsertProduct,
    dropProduct,
    setCategoryProducts,
  }
}

// Reload with the right visibility (inactive items) whenever the admin signs in or out.
const { isAdmin } = useAuth()
watch(isAdmin, () => {
  if (loaded.value) void useCatalog().load(true)
})
