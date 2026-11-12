<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import useAuthStore from './stores/authStore.js'
import { useAuth } from './composables/useAuth.js'

const auth = useAuthStore()
const router = useRouter()
const { logout } = useAuth()

const logoutUser = async () => {
  try {
    await logout()
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    auth.clearUser()
    router.push({ name: 'Signin' })
  }
}
</script>

<template>
  <nav class="bg-surface-card border-b border-surface-border shadow-flat sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
      <div class="flex items-center gap-8">
        <RouterLink to="/" class="text-xl font-black tracking-tight flex items-center gap-2">
          <svg class="w-6 h-6 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
          AeroBoard
        </RouterLink>
        <div v-if="auth.isAuthenticated" class="hidden md:flex items-center gap-1">
          <RouterLink to="/" class="px-3 py-2 rounded-btn font-medium text-text-muted hover:text-brand hover:bg-gray-50"
            exact-active-class="!text-brand bg-blue-50 font-semibold">Tablero</RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin" class="px-3 py-2 rounded-btn font-medium text-text-muted hover:text-brand hover:bg-gray-50"
            active-class="!text-brand bg-blue-50 font-semibold">Admin vuelos</RouterLink>
        </div>
      </div>

      <div v-if="!auth.isAuthenticated" class="flex items-center gap-2">
        <RouterLink to="/signin" class="px-4 py-2 font-medium text-text-muted hover:text-text-main">Ingresar</RouterLink>
        <RouterLink to="/signup" class="bg-brand hover:bg-brand-dark text-white font-bold px-4 py-2 rounded-btn shadow-flat">Registrarse</RouterLink>
      </div>

      <div v-else class="flex items-center gap-4">
        <div class="text-right hidden sm:block">
          <p class="font-bold leading-none">{{ auth.userEmail }}</p>
          <p class="text-[11px] font-semibold text-brand uppercase tracking-wider mt-1">{{ auth.isAdmin ? 'admin' : 'pasajero' }}</p>
        </div>
        <button @click="logoutUser"
          class="border border-surface-border hover:border-red-200 hover:bg-red-50 text-text-muted hover:text-red-700 font-medium px-3 py-2 rounded-btn">
          Cerrar sesión
        </button>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <RouterView />
  </main>
</template>