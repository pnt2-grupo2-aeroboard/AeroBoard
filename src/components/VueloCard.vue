<script setup>
import { computed } from 'vue'

const props = defineProps({
  vuelo: { type: Object, required: true }
})

const CODIGOS = {
  'Córdoba': 'COR', 'Bariloche': 'BRC', 'Mendoza': 'MDZ', 'Ushuaia': 'USH', 'Salta': 'SLA',
  'Iguazú': 'IGR', 'El Calafate': 'FTE', 'Tucumán': 'TUC', 'Neuquén': 'NQN',
  'Río de Janeiro': 'GIG', 'São Paulo': 'GRU', 'Miami': 'MIA', 'Madrid': 'MAD',
}

const ESTADOS = {
  'a horario':  { label: 'A horario',  clases: 'bg-green-50 text-green-700 border-green-200' },
  'demorado':   { label: 'Demorado',   clases: 'bg-amber-50 text-amber-700 border-amber-200' },
  'embarcando': { label: 'Embarcando', clases: 'bg-blue-50 text-blue-700 border-blue-200' },
  'cancelado':  { label: 'Cancelado',  clases: 'bg-red-50 text-red-700 border-red-200' },
}

const esPartida = computed(() => props.vuelo.tipo === 'partida')
const codigoCiudad = computed(() => CODIGOS[props.vuelo.origen_destino] ?? props.vuelo.origen_destino.slice(0, 3).toUpperCase())
const origen = computed(() => esPartida.value ? props.vuelo.aeropuerto : codigoCiudad.value)
const destino = computed(() => esPartida.value ? codigoCiudad.value : props.vuelo.aeropuerto)
const estado = computed(() => ESTADOS[props.vuelo.estado])
const hora = computed(() =>
  new Date(props.vuelo.fecha_hora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
)
</script>

<template>
  <article class="bg-surface-card border border-surface-border rounded-card shadow-flat p-5 flex flex-col gap-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold leading-tight">{{ vuelo.numero }}</h2>
        <p class="text-sm text-text-muted">{{ vuelo.aerolinea }}</p>
      </div>
      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold" :class="estado.clases">
        <span v-if="vuelo.estado === 'embarcando'" class="w-2 h-2 rounded-full bg-blue-600 animate-pulse" aria-hidden="true"></span>
        {{ estado.label }}
      </span>
    </div>

    <div class="flex items-center justify-between gap-3">
      <span class="text-2xl font-black">{{ origen }}</span>
      <div class="flex-1 flex items-center gap-2 text-text-muted" aria-hidden="true">
        <span class="flex-1 h-px bg-surface-border"></span>✈<span class="flex-1 h-px bg-surface-border"></span>
      </div>
      <span class="text-2xl font-black">{{ destino }}</span>
    </div>
    <p class="text-sm text-text-muted -mt-2">{{ esPartida ? 'Hacia' : 'Desde' }} <strong class="text-text-main">{{ vuelo.origen_destino }}</strong></p>

    <div class="flex items-end justify-between gap-3 pt-4 border-t border-surface-border">
      <div>
        <p class="text-xs font-semibold text-text-muted">HORA</p>
        <p class="text-3xl font-black text-brand tracking-tight">{{ hora }}</p>
      </div>
      <div class="flex gap-1.5">
        <span class="px-2.5 py-1 rounded-btn border border-surface-border bg-surface-bg text-sm text-text-muted">{{ esPartida ? 'Partida' : 'Arribo' }}</span>
        <span class="px-2.5 py-1 rounded-btn border border-surface-border bg-surface-bg text-sm text-text-muted">Puerta {{ vuelo.puerta ?? '–' }}</span>
      </div>
    </div>
  </article>
</template>