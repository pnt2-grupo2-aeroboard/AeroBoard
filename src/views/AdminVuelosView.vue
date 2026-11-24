<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import useVuelosAdmin from '../composables/useVuelosAdmin.js'
import { TIPOS, ESTADOS, AEROPUERTOS, CIUDADES } from '../services/vuelos.js'
import { etiquetaDia, ahoraParaInput } from '../utils/fecha.js'

const { vuelos, loading, error, loadVuelos, createVuelo, editVuelo, deleteVuelo } = useVuelosAdmin()

const emptyForm = () => ({
  numero: '', aerolinea: 'Aerolíneas Argentinas', aeropuerto: 'AEP', tipo: 'partida',
  origen_destino: '', fecha_hora: '', puerta: '', estado: 'a horario'
})

const form = reactive(emptyForm())
const editingId = ref(null)   // null = crear, id = editar
const confirmId = ref(null)   // vuelo que se está por borrar
const aviso = ref('')

const mostrarAviso = (texto) => {
  aviso.value = texto
  setTimeout(() => (aviso.value = ''), 2500)
}

const resetForm = () => {
  Object.assign(form, emptyForm())
  editingId.value = null
}

const startEdit = (vuelo) => {
  editingId.value = vuelo.id
  confirmId.value = null
  Object.assign(form, {
    numero: vuelo.numero,
    aerolinea: vuelo.aerolinea,
    aeropuerto: vuelo.aeropuerto,
    tipo: vuelo.tipo,
    origen_destino: vuelo.origen_destino,
    fecha_hora: vuelo.fecha_hora?.slice(0, 16) ?? '',   // formato del input datetime-local
    puerta: vuelo.puerta ?? '',
    estado: vuelo.estado
  })
}

const handleSubmit = async () => {
  const numero = form.numero.trim().toUpperCase()
  const creando = editingId.value === null
  const ok = creando
    ? await createVuelo({ ...form })
    : await editVuelo(editingId.value, { ...form })
  if (ok) {
    mostrarAviso(creando ? `Vuelo ${numero} creado` : `Vuelo ${numero} actualizado`)
    resetForm()
  }
}

const removeVuelo = async (vuelo) => {
  const ok = await deleteVuelo(vuelo.id)
  confirmId.value = null
  if (ok) {
    if (editingId.value === vuelo.id) resetForm()
    mostrarAviso(`Vuelo ${vuelo.numero} borrado`)
  }
}

const minFecha = ahoraParaInput()   // al crear no deja elegir el pasado
const hora = (fh) => new Date(fh).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

const COLORES = {
  'a horario': 'bg-green-50 text-green-700 border-green-200',
  'demorado': 'bg-amber-50 text-amber-700 border-amber-200',
  'embarcando': 'bg-blue-50 text-blue-700 border-blue-200',
  'cancelado': 'bg-red-50 text-red-700 border-red-200',
}

const labelCiudad = computed(() => (form.tipo === 'partida' ? 'Destino' : 'Origen'))

onMounted(() => loadVuelos())
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-3xl font-black tracking-tight">Administrar vuelos</h1>
      <p class="text-text-muted mt-1">Solo los administradores pueden crear, editar y borrar vuelos.</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <!-- Formulario -->
      <form @submit.prevent="handleSubmit"
        class="w-full lg:max-w-sm bg-surface-card border border-surface-border rounded-card shadow-flat p-6 flex flex-col gap-4">
        <h2 class="text-xl font-extrabold">{{ editingId === null ? 'Nuevo vuelo' : 'Editar vuelo' }}</h2>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label for="numero" class="text-sm font-bold">Número</label>
            <input id="numero" v-model="form.numero" required maxlength="6" pattern="[A-Za-z]{2}[0-9]{3,4}" title="2 letras y 3 o 4 números, ej: AR1520" placeholder="AR1520"
              class="h-11 px-3 border border-surface-border rounded-btn bg-surface-bg" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="aeropuerto" class="text-sm font-bold">Aeropuerto</label>
            <select id="aeropuerto" v-model="form.aeropuerto" class="h-11 px-2 border border-surface-border rounded-btn bg-surface-bg">
              <option v-for="a in AEROPUERTOS" :key="a" :value="a">{{ a === 'AEP' ? 'Aeroparque' : 'Ezeiza' }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label for="tipo" class="text-sm font-bold">Tipo</label>
            <select id="tipo" v-model="form.tipo" class="h-11 px-2 border border-surface-border rounded-btn bg-surface-bg capitalize">
              <option v-for="t in TIPOS" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="ciudad" class="text-sm font-bold">{{ labelCiudad }}</label>
            <select id="ciudad" v-model="form.origen_destino" required
              class="h-11 px-3 border border-surface-border rounded-btn bg-surface-bg">
              <option value="" disabled>Elegí una ciudad</option>
              <option v-for="(codigo, ciudad) in CIUDADES" :key="codigo" :value="ciudad">{{ ciudad }} ({{ codigo }})</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label for="fecha" class="text-sm font-bold">Fecha y hora</label>
            <input id="fecha" v-model="form.fecha_hora" type="datetime-local" required
              :min="editingId === null ? minFecha : undefined"
              class="h-11 px-2 border border-surface-border rounded-btn bg-surface-bg text-sm" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="puerta" class="text-sm font-bold">Puerta</label>
            <input id="puerta" v-model="form.puerta" maxlength="4" placeholder="5"
              class="h-11 px-3 border border-surface-border rounded-btn bg-surface-bg" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="estado" class="text-sm font-bold">Estado</label>
          <select id="estado" v-model="form.estado" class="h-11 px-2 border border-surface-border rounded-btn bg-surface-bg capitalize">
            <option v-for="e in ESTADOS" :key="e" :value="e">{{ e }}</option>
          </select>
        </div>

        <p v-if="error" role="alert" class="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-btn px-3 py-2">{{ error }}</p>

        <div class="flex gap-2">
          <button type="submit" :disabled="loading"
            class="flex-1 h-11 bg-brand hover:bg-brand-dark text-white font-bold rounded-btn disabled:opacity-60">
            {{ editingId === null ? 'Crear vuelo' : 'Guardar cambios' }}
          </button>
          <button v-if="editingId !== null" type="button" @click="resetForm"
            class="h-11 px-4 border border-surface-border rounded-btn font-semibold hover:bg-gray-50">Cancelar</button>
        </div>
      </form>

      <!-- Lista -->
      <section class="flex-1 w-full bg-surface-card border border-surface-border rounded-card shadow-flat overflow-hidden">
        <div class="px-5 py-4 flex justify-between items-center border-b border-surface-border">
          <h2 class="text-lg font-extrabold">Vuelos cargados</h2>
          <span class="text-sm text-text-muted">{{ vuelos.length }} vuelos</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px]">
            <thead class="bg-surface-bg text-left text-xs font-bold tracking-wider text-text-muted">
              <tr>
                <th class="px-4 py-3">HORA</th>
                <th class="px-4 py-3">VUELO</th>
                <th class="px-4 py-3">RUTA</th>
                <th class="px-4 py-3">ESTADO</th>
                <th class="px-4 py-3 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in vuelos" :key="v.id" class="border-t border-surface-border"
                :class="confirmId === v.id ? 'bg-red-50' : editingId === v.id ? 'bg-blue-50' : ''">
                <td class="px-4 py-2">
                  <span class="block text-xs font-semibold text-text-muted uppercase">{{ etiquetaDia(v.fecha_hora) }}</span>
                  <span class="text-lg font-black text-brand">{{ hora(v.fecha_hora) }}</span>
                </td>
                <td class="px-4 py-2 font-bold break-all">{{ v.numero }}</td>
                <td class="px-4 py-2 text-sm">
                  <span class="font-bold">{{ v.aeropuerto }}</span> · {{ v.tipo === 'partida' ? 'a' : 'desde' }} {{ v.origen_destino }}
                </td>
                <td class="px-4 py-2">
                  <span class="px-2.5 py-0.5 rounded-full border text-xs font-bold capitalize" :class="COLORES[v.estado]">{{ v.estado }}</span>
                </td>
                <td class="px-4 py-2">
                  <div v-if="confirmId !== v.id" class="flex justify-end gap-2">
                    <button type="button" :aria-label="`Editar vuelo ${v.numero}`" @click="startEdit(v)"
                      class="h-10 px-3 border border-surface-border rounded-btn text-sm font-semibold hover:bg-gray-50">Editar</button>
                    <button type="button" :aria-label="`Borrar vuelo ${v.numero}`" @click="confirmId = v.id"
                      class="h-10 px-3 border border-red-200 text-red-700 rounded-btn text-sm font-semibold hover:bg-red-50">Borrar</button>
                  </div>
                  <div v-else class="flex justify-end items-center gap-2">
                    <span class="text-sm font-bold text-red-700">¿Borrar?</span>
                    <button type="button" @click="removeVuelo(v)" class="h-10 px-3 bg-red-700 text-white rounded-btn text-sm font-bold">Sí</button>
                    <button type="button" @click="confirmId = null" class="h-10 px-3 border border-surface-border rounded-btn text-sm">No</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="!loading && !vuelos.length" class="p-10 text-center text-text-muted">No hay vuelos cargados.</p>
      </section>
    </div>

    <div v-if="aviso" role="status"
      class="fixed right-6 bottom-6 bg-text-main text-white font-semibold px-5 py-3 rounded-xl shadow-lg">
      ✓ {{ aviso }}
    </div>
  </div>
</template>