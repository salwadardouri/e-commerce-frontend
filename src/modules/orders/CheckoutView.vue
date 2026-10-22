<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import MBadge from '@/components/generic/MBadge.vue'
import MButton from '@/components/generic/MButton.vue'
import MEmpty from '@/components/generic/MEmpty.vue'
import MIcon from '@/components/generic/MIcon.vue'
import MInput from '@/components/generic/MInput.vue'
import MTextarea from '@/components/generic/MTextarea.vue'
import { fieldError } from '@/lib/errors'
import { LINE_STATUS_LABEL, assetUrl, formatPrice } from '@/lib/format'
import { useCart } from '@/modules/cart/cart.hook'
import SiteHeader from '@/modules/landing/components/SiteHeader.vue'
import type { Order } from '@/types/models'
import { useCheckout } from './orders.hook'

const cart = useCart()
const { place } = useCheckout()
const confirmed = ref<Order | null>(null)
const query = ref('')

const form = reactive({ customerName: '', customerEmail: '', customerPhone: '', shippingAddress: '', note: '' })

onMounted(() => void cart.check.run()) // fresh stock before the visitor commits

const issueOf = (productId: number) => cart.issues.value.get(productId)
const blocked = computed(() => cart.hasIssues.value || !cart.lines.value.length)
/** Total of the lines that can actually be bought (out-of-stock lines are not counted). */
const payable = computed(() => cart.lines.value.reduce((sum, l) => (issueOf(l.productId) ? sum : sum + l.price * l.quantity), 0))

const submit = async () => {
  if (blocked.value) return
  confirmed.value = (await place.run({ ...form, note: form.note || null })) ?? null
}
</script>

<template>
  <div class="min-h-screen bg-surface-muted">
    <SiteHeader v-model:query="query" />

    <main class="container-page py-10">
      <!-- Confirmation -->
      <div v-if="confirmed" class="mx-auto max-w-xl animate-scale-in rounded-3xl border border-surface-line bg-surface p-10 text-center shadow-lift">
        <div class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-mint-50 text-mint-600"><MIcon name="check" :size="32" :stroke="2.5" /></div>
        <h1 class="text-3xl font-extrabold">Merci {{ confirmed.customerName }} !</h1>
        <p class="mt-2 text-ink-soft">Votre commande a bien été enregistrée.</p>
        <p class="mt-6 inline-block rounded-xl bg-brand-50 px-4 py-2 font-mono text-sm font-bold text-brand-700">{{ confirmed.reference }}</p>
        <p class="mt-4 text-2xl font-extrabold">{{ formatPrice(confirmed.total) }}</p>
        <p class="mt-1 text-sm text-ink-soft">Nous vous contacterons au {{ confirmed.customerPhone }} pour la livraison.</p>
        <MButton to="/" class="mt-8" size="lg">Continuer mes achats</MButton>
      </div>

      <MEmpty v-else-if="!cart.lines.value.length" icon="cart" title="Votre panier est vide" description="Ajoutez des produits pour passer commande.">
        <MButton to="/">Retour à la boutique</MButton>
      </MEmpty>

      <div v-else class="grid gap-8 lg:grid-cols-[1fr_26rem]">
        <form class="space-y-5 rounded-3xl border border-surface-line bg-surface p-6 shadow-soft sm:p-8" novalidate @submit.prevent="submit">
          <h1 class="text-2xl font-extrabold">Finaliser la commande</h1>

          <p v-if="place.error.value && !cart.hasIssues.value" class="rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700" role="alert">
            {{ place.error.value.message }}
          </p>

          <div class="grid gap-5 sm:grid-cols-2">
            <MInput v-model="form.customerName" label="Nom complet" required autocomplete="name" :error="fieldError(place.error.value, 'customerName')" />
            <MInput v-model="form.customerPhone" label="Téléphone" type="tel" required autocomplete="tel" :error="fieldError(place.error.value, 'customerPhone')" />
          </div>
          <MInput v-model="form.customerEmail" label="Email" type="email" required autocomplete="email" :error="fieldError(place.error.value, 'customerEmail')" />
          <MTextarea v-model="form.shippingAddress" label="Adresse de livraison" :rows="3" required :error="fieldError(place.error.value, 'shippingAddress')" />
          <MTextarea v-model="form.note" label="Note (facultatif)" :rows="2" />

          <MButton type="submit" size="lg" block :loading="place.loading.value" :disabled="blocked">Confirmer la commande · {{ formatPrice(payable) }}</MButton>
          <p v-if="cart.hasIssues.value" class="text-center text-sm font-medium text-danger-600">
            Retirez les produits indisponibles pour pouvoir confirmer.
          </p>
        </form>

        <aside class="h-fit rounded-3xl border border-surface-line bg-surface p-6 shadow-soft lg:sticky lg:top-24">
          <h2 class="text-lg font-bold">Récapitulatif</h2>
          <ul class="mt-4 divide-y divide-surface-line">
            <li v-for="line in cart.lines.value" :key="line.productId" class="flex gap-3 py-3" :class="issueOf(line.productId) && 'opacity-90'">
              <img v-if="line.image" :src="assetUrl(line.image)" :alt="line.name" class="h-14 w-14 rounded-xl object-cover" :class="issueOf(line.productId) && 'grayscale'" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold">{{ line.name }}</p>
                <p class="text-xs text-ink-soft">{{ line.quantity }} × {{ formatPrice(line.price) }}</p>
                <MBadge v-if="issueOf(line.productId)" tone="danger" dot class="mt-1">
                  {{ LINE_STATUS_LABEL[issueOf(line.productId)!.status as keyof typeof LINE_STATUS_LABEL] }}
                  <template v-if="issueOf(line.productId)!.status === 'insufficient_stock'"> (reste {{ issueOf(line.productId)!.available }})</template>
                </MBadge>
              </div>
              <div class="flex flex-col items-end justify-between">
                <span class="text-sm font-bold tabular-nums" :class="issueOf(line.productId) && 'line-through opacity-60'">{{ formatPrice(line.price * line.quantity) }}</span>
                <button v-if="issueOf(line.productId)" type="button" class="text-xs font-semibold text-danger-600 hover:underline" @click="cart.remove(line.productId)">Retirer</button>
              </div>
            </li>
          </ul>
          <div class="mt-4 flex items-center justify-between border-t border-surface-line pt-4">
            <span class="text-ink-soft">Total</span>
            <span class="font-display text-2xl font-extrabold tabular-nums">{{ formatPrice(payable) }}</span>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>
