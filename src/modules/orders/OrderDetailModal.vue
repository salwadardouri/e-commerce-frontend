<script setup lang="ts">
import { reactive, watch } from 'vue'
import MBadge from '@/components/generic/MBadge.vue'
import MButton from '@/components/generic/MButton.vue'
import MInput from '@/components/generic/MInput.vue'
import MModal from '@/components/generic/MModal.vue'
import MSelect from '@/components/generic/MSelect.vue'
import MTextarea from '@/components/generic/MTextarea.vue'
import { useConfirm } from '@/composables/useConfirm'
import { fieldError } from '@/lib/errors'
import { ORDER_STATUS, ORDER_STATUS_OPTIONS, formatDate, formatPrice } from '@/lib/format'
import type { Order, OrderStatus, OrderUpdatePayload } from '@/types/models'

const props = defineProps<{ order: Order | null; saving?: boolean; error?: Error | null }>()
const open = defineModel<boolean>({ default: false })
const emit = defineEmits<{ save: [id: number, payload: OrderUpdatePayload]; delete: [order: Order] }>()

const { confirm } = useConfirm()

const form = reactive({
  status: 'pending' as OrderStatus,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingAddress: '',
  note: '',
})

watch(
  () => props.order,
  (o) => {
    if (o) Object.assign(form, { status: o.status, customerName: o.customerName, customerEmail: o.customerEmail, customerPhone: o.customerPhone, shippingAddress: o.shippingAddress, note: o.note ?? '' })
  },
  { immediate: true },
)

const save = () => props.order && emit('save', props.order.id, { ...form })

const askDelete = async () => {
  if (!props.order) return
  const ok = await confirm({
    title: `Supprimer la commande ${props.order.reference} ?`,
    message: 'Le stock des produits sera restitué. Cette action est définitive.',
    confirmLabel: 'Supprimer',
  })
  if (ok) emit('delete', props.order)
}
</script>

<template>
  <MModal v-model="open" size="lg" :title="order ? `Commande ${order.reference}` : ''">
    <div v-if="order" class="space-y-6">
      <div class="flex flex-wrap items-center gap-3 text-sm text-ink-soft">
        <MBadge :tone="ORDER_STATUS[order.status].tone" dot>{{ ORDER_STATUS[order.status].label }}</MBadge>
        <span>Passée le {{ formatDate(order.createdAt) }}</span>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-line">
        <table class="w-full text-sm">
          <thead class="bg-surface-muted text-xs uppercase text-ink-faint">
            <tr><th class="px-4 py-2 text-left">Produit</th><th class="px-4 py-2 text-center">Qté</th><th class="px-4 py-2 text-right">Prix</th><th class="px-4 py-2 text-right">Total</th></tr>
          </thead>
          <tbody class="divide-y divide-surface-line">
            <tr v-for="i in order.items" :key="i.id">
              <td class="px-4 py-2.5 font-medium">{{ i.productName }}</td>
              <td class="px-4 py-2.5 text-center tabular-nums">{{ i.quantity }}</td>
              <td class="px-4 py-2.5 text-right tabular-nums">{{ formatPrice(i.unitPrice) }}</td>
              <td class="px-4 py-2.5 text-right font-semibold tabular-nums">{{ formatPrice(i.lineTotal) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-surface-muted">
            <tr><td colspan="3" class="px-4 py-3 text-right font-semibold">Total</td><td class="px-4 py-3 text-right font-display text-lg font-extrabold tabular-nums">{{ formatPrice(order.total) }}</td></tr>
          </tfoot>
        </table>
      </div>

      <form class="space-y-4" novalidate @submit.prevent="save">
        <MSelect v-model="form.status" label="Statut" :options="ORDER_STATUS_OPTIONS" :disabled="order.status === 'cancelled'" />
        <p v-if="order.status === 'cancelled'" class="-mt-2 text-xs text-ink-faint">Une commande annulée ne peut plus changer de statut.</p>
        <p v-else-if="form.status === 'cancelled'" class="-mt-2 text-xs text-sun-700">L’annulation remet les produits en stock.</p>

        <div class="grid gap-4 sm:grid-cols-2">
          <MInput v-model="form.customerName" label="Client" :error="fieldError(error, 'customerName')" />
          <MInput v-model="form.customerPhone" label="Téléphone" :error="fieldError(error, 'customerPhone')" />
        </div>
        <MInput v-model="form.customerEmail" label="Email" type="email" :error="fieldError(error, 'customerEmail')" />
        <MTextarea v-model="form.shippingAddress" label="Adresse de livraison" :rows="2" :error="fieldError(error, 'shippingAddress')" />
        <MTextarea v-model="form.note" label="Note" :rows="2" />
      </form>
    </div>

    <template #footer>
      <MButton variant="ghost" class="mr-auto hover:!text-danger-600" @click="askDelete">Supprimer</MButton>
      <MButton variant="secondary" @click="open = false">Fermer</MButton>
      <MButton :loading="saving" @click="save">Enregistrer</MButton>
    </template>
  </MModal>
</template>
