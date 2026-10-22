import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/modules/auth/auth.hook'
import { SITE } from '@/lib/site'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAdmin?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 }),
  routes: [
    { path: '/', name: 'home', component: () => import('@/modules/landing/LandingView.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('@/modules/orders/CheckoutView.vue'), meta: { title: 'Commande' } },
    { path: '/login', name: 'login', component: () => import('@/modules/auth/LoginView.vue'), meta: { title: 'Connexion' } },
    {
      path: '/admin',
      component: () => import('@/modules/admin/AdminLayout.vue'),
      meta: { requiresAdmin: true, title: 'Administration' },
      children: [
        { path: '', name: 'admin', component: () => import('@/modules/admin/OverviewView.vue') },
        { path: 'landing', name: 'admin-landing', component: () => import('@/modules/admin/LandingEditorView.vue'), meta: { title: 'Page d’accueil' } },
        { path: 'categories', name: 'admin-categories', component: () => import('@/modules/admin/CategoriesView.vue'), meta: { title: 'Catégories' } },
        { path: 'products', name: 'admin-products', component: () => import('@/modules/admin/ProductsView.vue'), meta: { title: 'Produits' } },
        { path: 'orders', name: 'admin-orders', component: () => import('@/modules/admin/OrdersView.vue'), meta: { title: 'Commandes' } },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  if (!to.matched.some((r) => r.meta.requiresAdmin)) return true
  const { init, isAdmin } = useAuth()
  await init()
  return isAdmin.value ? true : { name: 'login', query: { redirect: to.fullPath } }
})

router.afterEach((to) => {
  const title = to.meta.title ?? [...to.matched].reverse().find((r) => r.meta.title)?.meta.title
  document.title = title ? `${title} · ${SITE.name}` : `${SITE.name} — Boutique`
})

export default router
