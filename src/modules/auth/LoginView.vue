<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MButton from '@/components/generic/MButton.vue'
import MInput from '@/components/generic/MInput.vue'
import { fieldError } from '@/lib/errors'
import { SITE } from '@/lib/site'
import { useAuth } from './auth.hook'

const { login } = useAuth()
const route = useRoute()
const router = useRouter()
const form = reactive({ email: '', password: '' })

const submit = async () => {
  const user = await login.run(form.email, form.password)
  if (!user) return
  const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : null
  await router.push(redirect ?? (user.roles.includes('ROLE_ADMIN') ? '/admin' : '/'))
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-aurora px-4 py-12">
    <div class="w-full max-w-md animate-scale-in">
      <RouterLink to="/" class="mb-8 flex items-center justify-center gap-2.5">
        <span class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient font-display text-xl font-extrabold text-white shadow-glow">{{ SITE.name[0] }}</span>
        <span class="font-display text-2xl font-extrabold">{{ SITE.name }}</span>
      </RouterLink>

      <form class="glass space-y-5 rounded-3xl p-8 shadow-lift" novalidate @submit.prevent="submit">
        <div>
          <h1 class="text-2xl font-extrabold">Espace administrateur</h1>
          <p class="mt-1 text-sm text-ink-soft">Connectez-vous pour gérer votre boutique.</p>
        </div>

        <p v-if="login.error.value" class="rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700" role="alert">
          {{ login.error.value.message }}
        </p>

        <MInput v-model="form.email" label="Email" type="email" autocomplete="username" required :error="fieldError(login.error.value, 'email')" />
        <MInput v-model="form.password" label="Mot de passe" type="password" autocomplete="current-password" required :error="fieldError(login.error.value, 'password')" />

        <MButton type="submit" block size="lg" :loading="login.loading.value">Se connecter</MButton>
      </form>

      <p class="mt-6 text-center text-sm text-ink-soft"><RouterLink to="/" class="font-medium text-brand-600 hover:underline">← Retour à la boutique</RouterLink></p>
    </div>
  </main>
</template>
