<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import MBadge from '@/components/generic/MBadge.vue'
import MButton from '@/components/generic/MButton.vue'
import MDrawer from '@/components/generic/MDrawer.vue'
import MEmpty from '@/components/generic/MEmpty.vue'
import MIcon from '@/components/generic/MIcon.vue'
import { LINE_STATUS_LABEL, assetUrl, formatPrice } from '@/lib/format'
import { useCart } from './cart.hook'

const cart = useCart()
const router = useRouter()

// Refresh prices/stock from the API every time the drawer opens.
watch(cart.isOpen, (open) => {
  if (open) void cart.check.run()
})

const checkout = () => {
  cart.close()
  void router.push('/checkout')
}
</script>

<template>
  <MDrawer v-model="cart.isOpen.value" title="Votre panier">
    <MEmpty v-if="!cart.lines.value.length" icon="cart" title="Votre panier est vide" description="Ajoutez des produits depuis la boutique.">
      <MButton variant="soft" @click="cart.close()">Continuer mes achats</MButton>
    </MEmpty>

    <ul v-else class="divide-y divide-surface-line">
      <li v-for="line in cart.lines.value" :key="line.productId" class="flex gap-3 py-4">
        <img v-if="line.image" :src="assetUrl(line.image)" :alt="line.name" class="h-20 w-20 shrink-0 rounded-xl object-cover" />
        <div v-else class="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-surface-sunken text-ink-faint"><MIcon name="image" /></div>

        <div class="flex min-w-0 flex-1 flex-col">
          <div class="flex items-start justify-between gap-2">
            <p class="truncate font-semibold">{{ line.name }}</p>
            <button type="button" class="text-ink-faint hover:text-danger-600" :aria-label="`Retirer ${line.name}`" @click="cart.remove(line.productId)">
              <MIcon name="trash" :size="16" />
            </button>
          </div>
          <p class="text-sm text-ink-soft">{{ formatPrice(line.price) }}</p>

          <MBadge v-if="cart.issues.value.get(line.productId)" tone="danger" dot class="mt-1 self-start">
            {{ LINE_STATUS_LABEL[cart.issues.value.get(line.productId)!.status as keyof typeof LINE_STATUS_LABEL] }}
            <template v-if="cart.issues.value.get(line.productId)!.status === 'insufficient_stock'">
              (reste {{ cart.issues.value.get(line.productId)!.available }})
            </template>
          </MBadge>

          <div class="mt-auto flex items-center justify-between pt-2">
            <div class="inline-flex items-center rounded-xl border border-surface-line">
              <button type="button" class="grid h-8 w-8 place-items-center text-ink-soft hover:text-brand-600 disabled:opacity-40" :disabled="line.quantity <= 1" aria-label="Diminuer" @click="cart.setQuantity(line.productId, line.quantity - 1)"><MIcon name="minus" :size="14" /></button>
              <span class="w-8 text-center text-sm font-semibold tabular-nums">{{ line.quantity }}</span>
              <button type="button" class="grid h-8 w-8 place-items-center text-ink-soft hover:text-brand-600 disabled:opacity-40" :disabled="line.quantity >= line.stock" aria-label="Augmenter" @click="cart.setQuantity(line.productId, line.quantity + 1)"><MIcon name="plus" :size="14" /></button>
            </div>
            <p class="font-bold tabular-nums">{{ formatPrice(line.price * line.quantity) }}</p>
          </div>
        </div>
      </li>
    </ul>

    <template v-if="cart.lines.value.length" #footer>
      <div class="mb-3 flex items-center justify-between">
        <span class="text-ink-soft">Total</span>
        <span class="font-display text-2xl font-extrabold tabular-nums">{{ formatPrice(cart.subtotal.value) }}</span>
      </div>
      <p v-if="cart.hasIssues.value" class="mb-3 rounded-xl bg-danger-50 p-3 text-sm text-danger-700">
        Certains produits sont en rupture ou en stock insuffisant. Retirez-les ou ajustez les quantités pour commander.
      </p>
      <MButton block size="lg" :disabled="cart.hasIssues.value || cart.check.loading.value" :loading="cart.check.loading.value" @click="checkout">
        Passer la commande
      </MButton>
    </template>
  </MDrawer>
</template>
