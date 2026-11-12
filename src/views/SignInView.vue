<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import useAuthStore from '../stores/authStore.js'
import getRoleByUserId from '../services/roles.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { login, loading, error } = useAuth()

const formValues = reactive({ email: '', password: '' })
const mostrarPassword = ref(false)

const loginUser = async () => {
  try {
    const { user, accessToken, refreshToken } = await login(formValues.email, formValues.password)
    auth.token = accessToken
    const role = await getRoleByUserId(user.id)
    auth.setUser(user, accessToken, role, refreshToken)

    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : { name: 'Tablero' })
  } catch (err) {
    error.value = err.response?.data?.error_description || err.response?.data?.msg || 'Email o contraseña incorrectos.'
  } finally {
    formValues.password = ''
  }
}

const noDisponible = (proveedor) => {
  error.value = `El inicio con ${proveedor} todavía no está disponible. Usá tu email.`
}
</script>

<template>
  <div class="flex justify-center pt-8">
    <div class="w-full max-w-md bg-surface-card border border-surface-border rounded-card shadow-flat p-8 flex flex-col gap-6">
      <div class="text-center">
        <h1 class="text-3xl font-black tracking-tight">Iniciar sesión</h1>
        <p class="text-text-muted mt-1">Entrá para ver y seguir tus vuelos.</p>
      </div>

      <div class="flex flex-col gap-3">
        <button type="button" @click="noDisponible('Google')"
          class="h-12 border border-surface-border rounded-btn font-semibold hover:bg-gray-50">
          Continuar con Google
        </button>
        <button type="button" @click="noDisponible('Apple')"
          class="h-12 bg-text-main text-white rounded-btn font-semibold hover:opacity-90">
          Continuar con Apple
        </button>
      </div>

      <div class="flex items-center gap-3" role="separator" aria-label="o">
        <span class="flex-1 h-px bg-surface-border" aria-hidden="true"></span>
        <span class="text-sm text-text-muted" aria-hidden="true">o</span>
        <span class="flex-1 h-px bg-surface-border" aria-hidden="true"></span>
      </div>

      <form @submit.prevent="loginUser" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm font-bold">Correo electrónico</label>
          <input id="email" v-model="formValues.email" type="email" autocomplete="username" required
            placeholder="nombre@correo.com"
            class="h-12 px-4 border border-surface-border rounded-btn bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-light" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-bold">Contraseña</label>
          <div class="relative">
            <input id="password" v-model="formValues.password" :type="mostrarPassword ? 'text' : 'password'"
              autocomplete="current-password" required
              class="w-full h-12 pl-4 pr-12 border border-surface-border rounded-btn bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-light" />
            <button type="button" aria-label="Mostrar contraseña" :aria-pressed="mostrarPassword" aria-controls="password"
              @click="mostrarPassword = !mostrarPassword"
              class="absolute right-0 top-0 w-12 h-12 flex items-center justify-center text-text-muted hover:text-brand">
              <svg v-if="!mostrarPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.4 10.4 0 0 1 12 5c5 0 9 4.5 10 7a13.4 13.4 0 0 1-3.2 4.3M6.6 6.6A13.5 13.5 0 0 0 2 12c1 2.5 5 7 10 7a9.9 9.9 0 0 0 5.4-1.6" />
              </svg>
            </button>
          </div>
        </div>

        <p v-if="error" role="alert" class="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-btn px-3 py-2">
          {{ error }}
        </p>

        <button type="submit" :disabled="loading"
          class="h-12 bg-brand hover:bg-brand-dark text-white font-bold rounded-btn shadow-flat disabled:opacity-60">
          {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="text-center text-sm text-text-muted">
        ¿No tenés cuenta? <RouterLink to="/signup" class="font-bold text-brand hover:underline">Registrate</RouterLink>
      </p>
    </div>
  </div>
</template>