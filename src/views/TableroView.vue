<script setup>
import { computed, onMounted, ref } from 'vue'
import useFetchVuelos from '../composables/useFetchVuelos.js'
import VueloCard from '../components/VueloCard.vue'

const { data, loading, error, retrieveVuelos } = useFetchVuelos()

const aeropuerto = ref('AEP')
const tipo = ref('todos')
const estado = ref(null)
const busqueda = ref('')

const ESTADOS = [
  { valor: 'a horario',  label: 'A horario',  punto: 'bg-green-600' },
  { valor: 'demorado',   label: 'Demorado',   punto: 'bg-amber-500' },
  { valor: 'embarcando', label: 'Embarcando', punto: 'bg-blue-600' },
  { valor: 'cancelado',  label: 'Cancelado',  punto: 'bg-red-600' },
]

// vuelos del aeropuerto elegido (para los contadores)
const delAeropuerto = computed(() => data.value.filter((v) => v.aeropuerto === aeropuerto.value))

const contadores = computed(() =>
  ESTADOS.map((e) => ({ ...e, cantidad: delAeropuerto.value.filter((v) => v.estado === e.valor).length }))
)

// vuelos que se muestran después de aplicar todos los filtros
const vuelosFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()
  return delAeropuerto.value
    .filter((v) => tipo.value === 'todos' || v.tipo === tipo.value)
    .filter((v) => !estado.value || v.estado === estado.value)
    .filter((v) => !texto || v.numero.toLowerCase().includes(texto) || v.origen_destino.toLowerCase().includes(texto))
})

const cambiarAeropuerto = (codigo) => {
  aeropuerto.value = codigo
  estado.value = null
}
const toggleEstado = (valor) => {
  estado.value = estado.value === valor ? null : valor
}
const limpiarFiltros = () => {
  tipo.value = 'todos'
  estado.value = null
  busqueda.value = ''
}

onMounted(() => retrieveVuelos())
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black tracking-tight">Arribos y Partidas</h1>
        <p class="text-text-muted mt-1">
          {{ aeropuerto === 'AEP' ? 'Aeroparque Jorge Newbery · vuelos de cabotaje.' : 'Aeropuerto Internacional de Ezeiza · vuelos internacionales.' }}
        </p>
      </div>
      <div role="group" aria-label="Aeropuerto" class="flex gap-1 p-1 bg-surface-card border border-surface-border rounded-xl">
        <button v-for="a in [{ c: 'AEP', n: 'Aeroparque' }, { c: 'EZE', n: 'Ezeiza' }]" :key="a.c" type="button"
          :aria-pressed="aeropuerto === a.c" @click="cambiarAeropuerto(a.c)"
          class="h-10 px-4 rounded-btn text-sm font-bold"
          :class="aeropuerto === a.c ? 'bg-brand text-white' : 'text-text-muted hover:bg-gray-50'">
          {{ a.n }}
        </button>
      </div>
    </div>

    <div role="group" aria-label="Filtrar por estado" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <button v-for="c in contadores" :key="c.valor" type="button" :aria-pressed="estado === c.valor" @click="toggleEstado(c.valor)"
        class="flex flex-col items-start gap-1 p-4 rounded-card border-2 text-left bg-surface-card"
        :class="estado === c.valor ? 'border-brand bg-blue-50' : 'border-surface-border hover:border-brand-light'">
        <span class="flex items-center gap-2 text-sm font-bold text-text-muted">
          <span class="w-2.5 h-2.5 rounded-full" :class="c.punto"></span>{{ c.label }}
        </span>
        <span class="text-3xl font-black">{{ c.cantidad }}</span>
      </button>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 bg-surface-card p-4 rounded-card border border-surface-border shadow-flat">
      <div class="relative flex-1 min-w-[240px] max-w-md">
        <label for="buscar" class="sr-only">Buscar por vuelo o ciudad</label>
        <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input id="buscar" v-model="busqueda" type="search" placeholder="Buscar por vuelo o ciudad..."
          class="w-full h-12 pl-10 pr-4 border border-surface-border rounded-btn bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-light" />
      </div>
      <div role="group" aria-label="Filtrar por tipo" class="flex gap-2">
        <button v-for="t in [{ v: 'todos', n: 'Todos' }, { v: 'partida', n: 'Partidas' }, { v: 'arribo', n: 'Arribos' }]" :key="t.v"
          type="button" :aria-pressed="tipo === t.v" @click="tipo = t.v"
          class="h-10 px-4 rounded-full text-sm font-bold border"
          :class="tipo === t.v ? 'bg-brand border-brand text-white' : 'bg-surface-bg border-surface-border text-text-muted hover:bg-gray-100'">
          {{ t.n }}
        </button>
      </div>
    </div>

    <p v-if="error" role="alert" class="text-red-700 bg-red-50 border border-red-200 rounded-btn px-4 py-3 font-semibold">{{ error }}</p>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
      <div v-for="n in 6" :key="n" class="h-56 bg-surface-card border border-surface-border rounded-card p-5 animate-pulse flex flex-col gap-4">
        <div class="h-6 w-1/3 bg-surface-border rounded"></div>
        <div class="h-8 w-2/3 bg-surface-border rounded"></div>
        <div class="h-10 w-1/2 bg-surface-border rounded mt-auto"></div>
      </div>
    </div>

    <div v-else-if="vuelosFiltrados.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <VueloCard v-for="vuelo in vuelosFiltrados" :key="vuelo.id" :vuelo="vuelo" />
    </div>

    <div v-else class="bg-surface-card border border-surface-border rounded-card p-12 text-center">
      <h3 class="text-xl font-bold">No hay vuelos para mostrar</h3>
      <p class="text-text-muted mt-1">Probá con otra búsqueda o sacá los filtros.</p>
      <button type="button" @click="limpiarFiltros"
        class="mt-5 h-11 px-5 border border-surface-border rounded-btn font-bold hover:bg-gray-50">Limpiar filtros</button>
    </div>
  </div>
</template>