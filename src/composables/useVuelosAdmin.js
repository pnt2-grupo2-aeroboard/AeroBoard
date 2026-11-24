import vueloService from '../services/vuelos.js'
import { extraerMsg } from '../services/api.js'
import { ref } from 'vue'

const useVuelosAdmin = (service = vueloService) => {
  const vuelos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // envuelve cada acción: maneja loading y error en un solo lugar
  const execute = async (actionCallback) => {
    loading.value = true
    error.value = null
    try {
      await actionCallback()
      return true
    } catch (err) {
      error.value = extraerMsg(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const loadVuelos = () => execute(async () => {
    vuelos.value = await service.fetchVuelos()
  })

  const createVuelo = async (vuelo) => {
    const ok = await execute(() => service.createVuelo(vuelo))
    if (ok) await loadVuelos()
    return ok
  }

  const editVuelo = async (id, vuelo) => {
    const ok = await execute(() => service.editVuelo(id, vuelo))
    if (ok) await loadVuelos()
    return ok
  }

  const deleteVuelo = async (id) => {
    const ok = await execute(() => service.deleteVuelo(id))
    if (ok) await loadVuelos()
    return ok
  }

  return { vuelos, loading, error, loadVuelos, createVuelo, editVuelo, deleteVuelo }
}

export default useVuelosAdmin