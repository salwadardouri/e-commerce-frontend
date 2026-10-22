<script setup lang="ts">
import { onMounted } from 'vue'
import MBadge from '@/components/generic/MBadge.vue'
import MButton from '@/components/generic/MButton.vue'
import MIcon from '@/components/generic/MIcon.vue'
import MSpinner from '@/components/generic/MSpinner.vue'
import MStatCard from '@/components/generic/MStatCard.vue'
import { ORDER_STATUS, assetUrl, formatDate, formatPrice } from '@/lib/format'
import { useDashboard } from '@/modules/dashboard/dashboard.hook'

const { summary, load } = useDashboard()
onMounted(() => void load.run())
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-extrabold sm:text-3xl">Aperçu</h1>
      <p class="text-sm text-ink-soft">L’activité de votre boutique en un coup d’œil.</p>
    </div>

    <div v-if="!summary" class="flex items-center gap-2 text-ink-faint"><MSpinner /> Chargement…</div>

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MStatCard label="Chiffre d’affaires" :value="formatPrice(summary.revenue)" hint="Commandes non annulées" icon="wallet" tone="brand" />
        <MStatCard label="Commandes" :value="summary.orders.total" :hint="`${summary.orders.byStatus.pending} en attente`" icon="clipboard" tone="accent" />
        <MStatCard label="Produits" :value="summary.products.total" :hint="`${summary.products.active} actifs · ${summary.categories} catégories`" icon="tag" tone="mint" />
        <MStatCard label="Ruptures de stock" :value="summary.products.outOfStock" hint="Produits à réapprovisionner" icon="alert" tone="sun" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <MStatCard label="Unités restantes en stock" :value="summary.products.unitsInStock" icon="package" tone="mint" />
        <MStatCard label="Unités vendues" :value="summary.products.unitsSold" icon="zap" tone="brand" />
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <section class="rounded-2xl border border-surface-line bg-surface p-5 shadow-soft">
          <header class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold">Stock faible</h2>
            <MButton to="/admin/products" variant="ghost" size="sm">Gérer</MButton>
          </header>
          <p v-if="!summary.lowStock.length" class="py-6 text-center text-sm text-ink-faint">Tout est bien approvisionné 🎉</p>
          <ul v-else class="divide-y divide-surface-line">
            <li v-for="p in summary.lowStock" :key="p.id" class="flex items-center gap-3 py-3">
              <img v-if="p.coverImage" :src="assetUrl(p.coverImage)" alt="" class="h-10 w-10 rounded-lg object-cover" />
              <span class="flex-1 truncate font-medium">{{ p.name }}</span>
              <MBadge :tone="p.stock === 0 ? 'danger' : 'warning'" dot>{{ p.stock === 0 ? 'Rupture' : `${p.stock} restant${p.stock > 1 ? 's' : ''}` }}</MBadge>
            </li>
          </ul>
        </section>

        <section class="rounded-2xl border border-surface-line bg-surface p-5 shadow-soft">
          <header class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold">Dernières commandes</h2>
            <MButton to="/admin/orders" variant="ghost" size="sm">Tout voir</MButton>
          </header>
          <p v-if="!summary.recentOrders.length" class="py-6 text-center text-sm text-ink-faint">Aucune commande pour le moment.</p>
          <ul v-else class="divide-y divide-surface-line">
            <li v-for="o in summary.recentOrders" :key="o.id" class="flex items-center gap-3 py-3">
              <div class="min-w-0 flex-1">
                <p class="truncate font-semibold">{{ o.customerName }}</p>
                <p class="text-xs text-ink-faint">{{ o.reference }} · {{ formatDate(o.createdAt) }}</p>
              </div>
              <MBadge :tone="ORDER_STATUS[o.status].tone" dot>{{ ORDER_STATUS[o.status].label }}</MBadge>
              <span class="w-20 text-right font-bold tabular-nums">{{ formatPrice(o.total) }}</span>
            </li>
          </ul>
        </section>
      </div>

      <MButton to="/admin/landing" variant="soft"><template #leading><MIcon name="edit" :size="16" /></template>Modifier la page d’accueil en direct</MButton>
    </template>
  </div>
</template>
