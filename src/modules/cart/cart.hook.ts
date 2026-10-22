import { computed, ref, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAsyncAction } from '@/composables/useAsyncAction'
import type { CartCheck, CartCheckLine, Product } from '@/types/models'

export interface CartLine {
  productId: number
  name: string
  price: number
  image: string | null
  /** Last known remaining stock (refreshed by `check`) */
  stock: number
  quantity: number
}

const STORAGE_KEY = 'vitrine.cart'

const restore = (): CartLine[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

// Module-level state: the cart is shared by header, product cards, drawer and checkout.
const lines = ref<CartLine[]>(restore())
const isOpen = ref(false)
const serverCheck = ref<CartCheck | null>(null)

watch(
  lines,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      /* storage unavailable: cart lives for the session only */
    }
  },
  { deep: true },
)

export function useCart() {
  const api = useApi()

  const count = computed(() => lines.value.reduce((n, l) => n + l.quantity, 0))
  const subtotal = computed(() => lines.value.reduce((sum, l) => sum + l.price * l.quantity, 0))

  /** Per-product problem reported by the server on the last check. */
  const issues = computed(() => {
    const map = new Map<number, CartCheckLine>()
    for (const l of serverCheck.value?.lines ?? []) if (l.status !== 'ok') map.set(l.productId, l)
    return map
  })
  const hasIssues = computed(() => issues.value.size > 0)
  const quantityOf = (productId: number) => lines.value.find((l) => l.productId === productId)?.quantity ?? 0

  /** @returns false if the product cannot be added (out of stock / stock already reached) */
  const add = (product: Product, quantity = 1): boolean => {
    if (!product.inStock || product.stock <= 0) return false
    const existing = lines.value.find((l) => l.productId === product.id)
    const next = (existing?.quantity ?? 0) + quantity
    if (next > product.stock) return false

    if (existing) {
      existing.quantity = next
      existing.stock = product.stock
      existing.price = product.price
    } else {
      lines.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.coverImage,
        stock: product.stock,
        quantity,
      })
    }
    serverCheck.value = null
    return true
  }

  const setQuantity = (productId: number, quantity: number) => {
    const line = lines.value.find((l) => l.productId === productId)
    if (!line) return
    line.quantity = Math.max(1, Math.min(quantity, Math.max(line.stock, 1)))
    serverCheck.value = null
  }

  const remove = (productId: number) => {
    lines.value = lines.value.filter((l) => l.productId !== productId)
    serverCheck.value = null
  }

  const clear = () => {
    lines.value = []
    serverCheck.value = null
  }

  /** Asks the API for real prices/stock and flags out-of-stock lines. Also refreshes the local snapshot. */
  const check = useAsyncAction(
    async () => {
      if (!lines.value.length) {
        serverCheck.value = { lines: [], total: 0, hasIssues: false }
        return serverCheck.value
      }
      const result = await api.post<CartCheck>('/cart/check', {
        items: lines.value.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      })
      for (const sl of result.lines) {
        const line = lines.value.find((l) => l.productId === sl.productId)
        if (line && sl.price !== null) Object.assign(line, { price: sl.price, stock: sl.available, name: sl.name ?? line.name })
      }
      serverCheck.value = result
      return result
    },
    { silent: true },
  )

  /** Mirrors issues returned by a rejected checkout (409). */
  const applyIssues = (rejected: CartCheckLine[]) => {
    serverCheck.value = { lines: rejected, total: 0, hasIssues: true }
  }

  return {
    lines,
    isOpen,
    count,
    subtotal,
    issues,
    hasIssues,
    serverCheck,
    quantityOf,
    add,
    setQuantity,
    remove,
    clear,
    check,
    applyIssues,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
  }
}
