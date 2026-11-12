<script setup>
import { reactive } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import { useRouter } from 'vue-router'

const { register, loading, error } = useAuth()
const router = useRouter()

const formValues = reactive({ email: '', password: '' })

const registerUser = async () => {
  try {
    await register(formValues.email, formValues.password)
    router.push('/signin')
  } catch (err) {
    error.value = err.message || 'Ocurrió un error al registrarse.'
  } finally {
    formValues.email = ''
    formValues.password = ''
  }
}
</script>

<template>
  <h1>Registrarse</h1>
  <form @submit.prevent="registerUser">
    <input type="email" placeholder="Email" v-model="formValues.email" />
    <input type="password" placeholder="Contraseña" v-model="formValues.password" />
    <button type="submit">{{ loading ? 'Registrando...' : 'Registrarse' }}</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>