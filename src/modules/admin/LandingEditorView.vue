<script setup lang="ts">
import MBar from '@/components/generic/MBar.vue'
import MIcon from '@/components/generic/MIcon.vue'
import LandingPage from '@/modules/landing/LandingPage.vue'
</script>

<template>
  <div class="space-y-4">
    <MBar tone="soft" class="overflow-hidden rounded-2xl">
      <span class="inline-flex items-center gap-2"><MIcon name="edit" :size="16" /> Vous éditez la vraie page d’accueil : cliquez sur un prix ou un stock, changez une image, glissez les cartes et les catégories.</span>
    </MBar>
    <div class="overflow-hidden rounded-3xl border border-surface-line bg-surface shadow-soft"><LandingPage force-edit /></div>
  </div>
</template>
