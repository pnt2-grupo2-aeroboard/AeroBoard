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
  <h1>AeroBoard</h1>
  <div v-if="auth.isAuthenticated">
    Hola, {{ auth.userEmail }}
    <button @click="logoutUser">Salir</button>
  </div>
  <nav>
    <RouterLink to="/">Tablero</RouterLink> |
    <RouterLink to="/admin" v-if="auth.isAdmin">Admin vuelos</RouterLink>
    <RouterLink to="/signin" v-if="!auth.isAuthenticated">Ingresar</RouterLink> |
    <RouterLink to="/signup" v-if="!auth.isAuthenticated">Registrarse</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>