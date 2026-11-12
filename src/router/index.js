import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '../stores/authStore.js'

const routes = [
  { path: '/', name: 'Tablero', component: () => import('../views/TableroView.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../views/AdminVuelosView.vue'), meta: { requiresAdmin: true } },
  { path: '/signin', name: 'Signin', component: () => import('../views/SignInView.vue') },
  { path: '/signup', name: 'Signup', component: () => import('../views/SignUpView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// guard: antes de cada navegación revisa si puede entrar
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.requiresAdmin) return

  if (!auth.isAuthenticated) {
    return { name: 'Signin', query: { redirect: to.fullPath } }
  }
  if (!auth.isAdmin) {
    return { name: 'Tablero' }
  }
})

export default router