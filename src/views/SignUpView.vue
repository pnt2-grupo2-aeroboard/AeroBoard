<script setup>
import { reactive } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { useRouter, RouterLink } from 'vue-router'

const { register, loading, error } = useAuth()
const router = useRouter()

const formValues = reactive({ email: '', password: '' })

const registerUser = async () => {
  try {
    await register(formValues.email, formValues.password)
    router.push('/signin')
  } catch (err) {
    error.value = err.response?.data?.msg || 'No se pudo crear la cuenta.'
  } finally {
    formValues.password = ''
  }
}
</script>

<template>
  <div class="flex justify-center pt-8">
    <div class="w-full max-w-md bg-surface-card border border-surface-border rounded-card shadow-flat p-8 flex flex-col gap-6">
      <div class="text-center">
        <h1 class="text-3xl font-black tracking-tight">Crear cuenta</h1>
        <p class="text-text-muted mt-1">Registrate para ver el tablero de vuelos.</p>
      </div>

      <form @submit.prevent="registerUser" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm font-bold">Correo electrónico</label>
          <input id="email" v-model="formValues.email" type="email" autocomplete="username" required
            placeholder="nombre@correo.com"
            class="h-12 px-4 border border-surface-border rounded-btn bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-light" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-bold">Contraseña</label>
          <input id="password" v-model="formValues.password" type="password" autocomplete="new-password" required minlength="6"
            class="h-12 px-4 border border-surface-border rounded-btn bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-light" />
          <p class="text-xs text-text-muted">Mínimo 6 caracteres.</p>
        </div>

        <p v-if="error" role="alert" class="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-btn px-3 py-2">
          {{ error }}
        </p>

        <button type="submit" :disabled="loading"
          class="h-12 bg-brand hover:bg-brand-dark text-white font-bold rounded-btn shadow-flat disabled:opacity-60">
          {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="text-center text-sm text-text-muted">
        ¿Ya tenés cuenta? <RouterLink to="/signin" class="font-bold text-brand hover:underline">Iniciá sesión</RouterLink>
      </p>
    </div>
  </div>
</template>