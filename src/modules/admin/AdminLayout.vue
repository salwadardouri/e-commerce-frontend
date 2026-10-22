<script setup lang="ts">
import { useRouter } from 'vue-router'
import MButton from '@/components/generic/MButton.vue'
import MHeader from '@/components/generic/MHeader.vue'
import MIcon from '@/components/generic/MIcon.vue'
import { SITE } from '@/lib/site'
import { useAuth } from '@/modules/auth/auth.hook'

const { user, logout } = useAuth()
const router = useRouter()

const NAV: { to: string; label: string; icon: string; exact?: boolean }[] = [
  { to: '/admin', label: 'Aperçu', icon: 'chart', exact: true },
  { to: '/admin/landing', label: 'Page d’accueil', icon: 'layout' },
  { to: '/admin/categories', label: 'Catégories', icon: 'grid' },
  { to: '/admin/products', label: 'Produits', icon: 'tag' },
  { to: '/admin/orders', label: 'Commandes', icon: 'clipboard' },
]

const signOut = async () => {
  await logout()
  await router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-surface-muted">
    <MHeader :contained="false">
      <template #logo>
        <RouterLink to="/admin" class="flex items-center gap-2.5">
          <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient font-display text-lg font-extrabold text-white shadow-glow">{{ SITE.name[0] }}</span>
          <span class="font-display text-lg font-extrabold">{{ SITE.name }} <span class="text-ink-faint">Admin</span></span>
        </RouterLink>
      </template>
      <template #actions>
        <span class="hidden text-sm text-ink-soft sm:inline">{{ user?.email }}</span>
        <MButton to="/" variant="secondary" size="sm"><template #leading><MIcon name="home" :size="15" /></template>Voir le site</MButton>
        <MButton variant="ghost" size="sm" icon aria-label="Se déconnecter" title="Se déconnecter" @click="signOut"><MIcon name="logout" :size="17" /></MButton>
      </template>
    </MHeader>

    <div class="lg:grid lg:grid-cols-[15rem_1fr]">
      <nav class="flex gap-1 overflow-x-auto border-b border-surface-line bg-surface px-3 py-2 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-6" aria-label="Administration">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          :exact-active-class="item.exact ? 'nav-active' : ''"
          :active-class="item.exact ? '' : 'nav-active'"
          class="flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-surface-sunken hover:text-ink"
        >
          <MIcon :name="item.icon" :size="18" /> {{ item.label }}
        </RouterLink>
      </nav>

      <main class="min-w-0 p-4 sm:p-6 lg:p-8"><RouterView /></main>
    </div>
  </div>
</template>

<style scoped>
.nav-active {
  background-image: linear-gradient(135deg, rgb(124 92 255 / 0.12), rgb(255 61 132 / 0.1));
  color: var(--color-brand-700);
}
</style>
