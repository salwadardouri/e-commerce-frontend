import { ref } from 'vue'
import { ApiError, useApi } from '@/composables/useApi'
import { useAsyncAction } from '@/composables/useAsyncAction'
import { useCart } from '@/modules/cart/cart.hook'
import { useCatalog } from '@/modules/catalog/catalog.hook'
import type { CartCheckLine, Order, OrderPayload, OrderStatus, OrderUpdatePayload } from '@/types/models'

/** Visitor side: confirm the cart as an order. */
export function useCheckout() {
  const api = useApi()
  const cart = useCart()
  const catalog = useCatalog()
  const rejectedLines = ref<CartCheckLine[]>([])

  const place = useAsyncAction(
    async (payload: Omit<OrderPayload, 'items'>) => {
      rejectedLines.value = []
      try {
        const order = await api.post<Order>('/orders', {
          ...payload,
          items: cart.lines.value.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        })
        cart.clear()
        void catalog.load(true) // stock changed
        return order
      } catch (e) {
        // 409: some lines are out of stock — show them instead of a generic error.
        if (e instanceof ApiError && e.status === 409) {
          const lines = (e.data as { lines?: CartCheckLine[] } | null)?.lines ?? []
          rejectedLines.value = lines
          cart.applyIssues(lines)
          void cart.check.run()
        }
        throw e
      }
    },
    { silent: true },
  )

  return { place, rejectedLines }
}

/** Admin side: list / edit / delete orders. */
export function useOrders() {
  const api = useApi()
  const orders = ref<Order[]>([])

  const load = useAsyncAction(async (status?: OrderStatus | '') => {
    orders.value = await api.get<Order[]>('/orders', status ? { status } : undefined)
  })

  const replace = (order: Order) => {
    const i = orders.value.findIndex((o) => o.id === order.id)
    if (i >= 0) orders.value[i] = order
  }

  const update = useAsyncAction(
    async (id: number, payload: OrderUpdatePayload) => {
      const order = await api.patch<Order>(`/orders/${id}`, payload)
      replace(order)
      return order
    },
    { success: 'Commande mise à jour' },
  )

  const remove = useAsyncAction(
    async (id: number) => {
      await api.remove(`/orders/${id}`)
      orders.value = orders.value.filter((o) => o.id !== id)
    },
    { success: 'Commande supprimée' },
  )

  return { orders, load, update, remove }
}
