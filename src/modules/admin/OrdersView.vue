<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import MBadge from '@/components/generic/MBadge.vue'
import MSelect from '@/components/generic/MSelect.vue'
import MTable, { type Column } from '@/components/generic/MTable.vue'
import { ORDER_STATUS, ORDER_STATUS_OPTIONS, formatDate, formatPrice } from '@/lib/format'
import OrderDetailModal from '@/modules/orders/OrderDetailModal.vue'
import { useOrders } from '@/modules/orders/orders.hook'
import type { Order, OrderStatus } from '@/types/models'

const { orders, load, update, remove } = useOrders()

const status = ref<OrderStatus | ''>('')
const selected = ref<Order | null>(null)
const modalOpen = ref(false)

const COLUMNS: Column[] = [
  { key: 'reference', label: 'Référence' },
  { key: 'customerName', label: 'Client' },
  { key: 'createdAt', label: 'Date', class: 'hidden md:table-cell' },
  { key: 'itemCount', label: 'Articles', align: 'center', class: 'hidden sm:table-cell' },
  { key: 'total', label: 'Total', align: 'right' },
  { key: 'status', label: 'Statut' },
]

onMounted(() => void load.run(status.value))
watch(status, (s) => void load.run(s))

const open = (order: Order) => {
  selected.value = order
  modalOpen.value = true
}

const save = async (id: number, payload: Parameters<typeof update.run>[1]) => {
  const updated = await update.run(id, payload)
  if (updated) selected.value = updated
}

const removeOrder = async (order: Order) => {
  await remove.run(order.id)
  modalOpen.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold sm:text-3xl">Commandes</h1>
        <p class="text-sm text-ink-soft">Suivez et modifiez les commandes de vos clients.</p>
      </div>
      <div class="w-full sm:w-56"><MSelect v-model="status" :options="ORDER_STATUS_OPTIONS" placeholder="Tous les statuts" /></div>
    </div>

    <MTable :columns="COLUMNS" :rows="orders" clickable :loading="load.loading.value" @row-click="open">
      <template #empty>Aucune commande.</template>
      <template #cell-reference="{ row }"><span class="font-mono text-xs font-bold">{{ row.reference }}</span></template>
      <template #cell-customerName="{ row }">
        <p class="font-semibold">{{ row.customerName }}</p>
        <p class="text-xs text-ink-faint">{{ row.customerPhone }}</p>
      </template>
      <template #cell-createdAt="{ row }">{{ formatDate(row.createdAt) }}</template>
      <template #cell-total="{ row }"><span class="font-bold tabular-nums">{{ formatPrice(row.total) }}</span></template>
      <template #cell-status="{ row }"><MBadge :tone="ORDER_STATUS[row.status as OrderStatus].tone" dot>{{ ORDER_STATUS[row.status as OrderStatus].label }}</MBadge></template>
    </MTable>

    <OrderDetailModal v-model="modalOpen" :order="selected" :saving="update.loading.value" :error="update.error.value" @save="save" @delete="removeOrder" />
  </div>
</template>
