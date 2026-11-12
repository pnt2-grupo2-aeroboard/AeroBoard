import vueloService from '../services/vuelos.js'
import { extraerMsg } from '../services/api.js'
import { ref } from 'vue'

const useFetchVuelos = () => {
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)

  const retrieveVuelos = async () => {
    loading.value = true
    error.value = null
    try {
      data.value = await vueloService.fetchVuelos()
    } catch (e) {
      error.value = extraerMsg(e)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, retrieveVuelos }
}

export default useFetchVuelos