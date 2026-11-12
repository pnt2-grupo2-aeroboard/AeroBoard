<script setup>
import { reactive } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { useRoute, useRouter } from 'vue-router'
import useAuthStore from '../stores/authStore.js'
import getRoleByUserId from '../services/roles.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { login, loading, error } = useAuth()

const formValues = reactive({ email: '', password: '' })

const loginUser = async () => {
  try {
    const { user, accessToken, refreshToken } = await login(formValues.email, formValues.password)
    auth.token = accessToken
    const role = await getRoleByUserId(user.id)
    auth.setUser(user, accessToken, role, refreshToken)

    // vuelve a donde quería ir (ej: /admin) o al tablero
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : { name: 'Tablero' })
  } catch (err) {
    error.value = err.response?.data?.error_description || err.message || 'Error al iniciar sesión.'
  } finally {
    formValues.email = ''
    formValues.password = ''
  }
}
</script>

<template>
  <h1>Iniciar sesión</h1>
  <form @submit.prevent="loginUser">
    <input type="email" placeholder="Email" v-model="formValues.email" />
    <input type="password" placeholder="Contraseña" v-model="formValues.password" />
    <button type="submit">{{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>