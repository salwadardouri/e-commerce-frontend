<script setup lang="ts">
import { SITE } from '@/lib/site'
</script>

<template>
  <footer class="bg-ink-gradient text-white">
    <div class="container-page grid gap-8 py-12 md:grid-cols-3">
      <div>
        <p class="font-display text-2xl font-extrabold">{{ SITE.name }}</p>
        <p class="mt-2 max-w-xs text-sm text-white/70">{{ SITE.tagline }}</p>
      </div>
      <div class="text-sm">
        <p class="font-semibold">Contact</p>
        <a :href="`mailto:${SITE.email}`" class="mt-2 block text-white/70 hover:text-white">{{ SITE.email }}</a>
      </div>
      <div class="text-sm">
        <p class="font-semibold">Informations</p>
        <p class="mt-2 text-white/70">Paiement à la livraison · Retours sous 14 jours</p>
      </div>
    </div>
    <div class="border-t border-white/10 py-4 text-center text-xs text-white/50">© {{ new Date().getFullYear() }} {{ SITE.name }}. Tous droits réservés.</div>
  </footer>
</template>
