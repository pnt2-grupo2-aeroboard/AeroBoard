<script setup>
import { onMounted } from 'vue'
import useFetchVuelos from '../composables/useFetchVuelos.js'

const { data, loading, error, retrieveVuelos } = useFetchVuelos()

onMounted(() => retrieveVuelos())
</script>

<template>
  <h1>Arribos y Partidas</h1>
  <p v-if="loading">Cargando vuelos...</p>
  <p v-if="error">{{ error }}</p>
  <ul>
    <li v-for="vuelo in data" :key="vuelo.id">
      {{ vuelo.numero }} · {{ vuelo.origen_destino }} · {{ vuelo.estado }} · {{ vuelo.aeropuerto }}
    </li>
  </ul>
</template>