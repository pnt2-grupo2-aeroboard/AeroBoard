import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '../stores/authStore.js'

const routes = [
  { path: '/', name: 'Tablero', component: () => import('../views/TableroView.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../views/AdminVuelosView.vue'), meta: { requiresAdmin: true } },
  { path: '/signin', name: 'Signin', component: () => import('../views/SignInView.vue') },
  { path: '/signup', name: 'Signup', component: () => import('../views/SignUpView.vue') },
  { path: '/', name: 'Tablero', component: () => import('../views/TableroView.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to) => {
  const auth = useAuthStore()
  const necesitaLogin = to.meta.requiresAuth || to.meta.requiresAdmin
  if (!necesitaLogin) return

  if (!auth.isAuthenticated) {
    return { name: 'Signin', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'Tablero' }
  }
})

export default router