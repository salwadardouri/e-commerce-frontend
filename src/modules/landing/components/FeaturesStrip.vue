<script setup lang="ts">
import MIcon from '@/components/generic/MIcon.vue'

const FEATURES = [
  { icon: 'truck', title: 'Livraison rapide', text: 'Expédition sous 24 h, suivi inclus.' },
  { icon: 'shield', title: 'Paiement sécurisé', text: 'Vous confirmez, nous vous contactons.' },
  { icon: 'zap', title: 'Stock en temps réel', text: 'Les ruptures sont signalées avant la commande.' },
  { icon: 'star', title: 'Sélection soignée', text: 'Chaque produit est testé par notre équipe.' },
] as const
</script>

<template>
  <section class="border-y border-surface-line bg-surface-muted" aria-label="Nos engagements">
    <ul class="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="f in FEATURES" :key="f.title" class="flex items-start gap-3">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-600"><MIcon :name="f.icon" /></span>
        <div>
          <h3 class="text-sm font-bold">{{ f.title }}</h3>
          <p class="text-sm text-ink-soft">{{ f.text }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>
