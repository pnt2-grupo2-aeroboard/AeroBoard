import { describe, it, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import useVuelosAdmin from '../src/composables/useVuelosAdmin.js'

setActivePinia(createPinia())

// un service falso: no llama a Supabase, guarda los vuelos en memoria
const crearServiceFalso = () => {
  const vuelos = [{ id: 1, numero: 'AR1520' }]
  return {
    fetchVuelos: vi.fn(async () => [...vuelos]),
    createVuelo: vi.fn(async (v) => { vuelos.push({ id: 2, ...v }) }),
    editVuelo: vi.fn(async () => {}),
    deleteVuelo: vi.fn(async () => {}),
  }
}

describe('useVuelosAdmin', () => {
  it('loadVuelos trae los vuelos del service', async () => {
    const service = crearServiceFalso()
    const { vuelos, loadVuelos } = useVuelosAdmin(service)

    await loadVuelos()

    expect(vuelos.value).toHaveLength(1)
    expect(vuelos.value[0].numero).toBe('AR1520')
  })

  it('createVuelo crea el vuelo, recarga la lista y devuelve true', async () => {
    const service = crearServiceFalso()
    const { vuelos, createVuelo } = useVuelosAdmin(service)

    const ok = await createVuelo({ numero: 'AR1999' })

    expect(ok).toBe(true)
    expect(service.createVuelo).toHaveBeenCalledOnce()
    expect(vuelos.value).toHaveLength(2)   // se recargó la lista
  })

  it('si el service falla, devuelve false y guarda el error', async () => {
    const service = crearServiceFalso()
    service.createVuelo = vi.fn(async () => { throw new Error('No tenés permisos') })
    const { createVuelo, error, loading } = useVuelosAdmin(service)

    const ok = await createVuelo({ numero: 'AR1999' })

    expect(ok).toBe(false)
    expect(error.value).toBe('No tenés permisos')
    expect(loading.value).toBe(false)      // el finally apaga el loading
  })

  it('deleteVuelo llama al service con el id correcto', async () => {
    const service = crearServiceFalso()
    const { deleteVuelo } = useVuelosAdmin(service)

    await deleteVuelo(1)

    expect(service.deleteVuelo).toHaveBeenCalledWith(1)
  })
})