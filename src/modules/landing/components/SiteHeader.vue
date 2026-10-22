<script setup lang="ts">
import MButton from '@/components/generic/MButton.vue'
import MHeader from '@/components/generic/MHeader.vue'
import MIcon from '@/components/generic/MIcon.vue'
import MSearch from '@/components/generic/MSearch.vue'
import { SITE } from '@/lib/site'
import { useAuth } from '@/modules/auth/auth.hook'
import { useCart } from '@/modules/cart/cart.hook'

defineProps<{ sticky?: boolean }>()
const query = defineModel<string>('query', { default: '' })

const { isAdmin, isLoggedIn, logout } = useAuth()
const cart = useCart()
</script>

<template>
  <MHeader :sticky="sticky ?? true">
    <template #logo>
      <RouterLink to="/" class="flex items-center gap-2.5" :aria-label="SITE.name">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient font-display text-lg font-extrabold text-white shadow-glow">{{ SITE.name[0] }}</span>
        <span class="hidden font-display text-xl font-extrabold sm:inline">{{ SITE.name }}</span>
      </RouterLink>
    </template>

    <template #nav>
      <div class="mx-auto w-full max-w-md"><MSearch v-model="query" placeholder="Rechercher un produit…" /></div>
    </template>

    <template #actions>
      <div class="w-full max-w-[14rem] md:hidden"><MSearch v-model="query" placeholder="Rechercher…" /></div>
      <MButton v-if="isAdmin" to="/admin" variant="soft" size="sm" class="hidden sm:inline-flex">
        <template #leading><MIcon name="layout" :size="16" /></template>
        Dashboard
      </MButton>
      <MButton v-if="isLoggedIn" variant="ghost" icon title="Se déconnecter" aria-label="Se déconnecter" @click="logout"><MIcon name="logout" :size="18" /></MButton>
      <MButton v-else to="/login" variant="ghost" icon title="Connexion admin" aria-label="Connexion admin"><MIcon name="user" :size="18" /></MButton>

      <button
        type="button"
        class="relative grid h-10 w-10 place-items-center rounded-xl bg-ink text-white transition hover:bg-brand-900"
        aria-label="Ouvrir le panier"
        @click="cart.open()"
      >
        <MIcon name="cart" :size="18" />
        <span
          v-if="cart.count.value"
          class="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white ring-2 ring-white"
        >{{ cart.count.value }}</span>
      </button>
    </template>
  </MHeader>
</template>
