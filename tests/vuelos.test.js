import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import vueloService from '../src/services/vuelos.js'

setActivePinia(createPinia())


const manana = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
const vueloOk = { numero: 'AR1520', tipo: 'partida', origen_destino: 'Córdoba', puerta: '5', fecha_hora: manana }

describe('validación de vuelos', () => {
  it('rechaza un número de vuelo sin formato real', async () => {
    await expect(vueloService.createVuelo({ ...vueloOk, numero: 'ASDASD' }))
      .rejects.toThrow('2 letras y 3 o 4 números')
  })

  it('rechaza una ciudad que no está en la lista', async () => {
    await expect(vueloService.createVuelo({ ...vueloOk, origen_destino: 'asdasdasd' }))
      .rejects.toThrow('Elegí una ciudad de la lista')
  })

  it('rechaza una puerta inválida', async () => {
    await expect(vueloService.createVuelo({ ...vueloOk, puerta: 'TUNG' }))
      .rejects.toThrow('La puerta debe ser un número')
  })

  it('no deja crear un vuelo en el pasado', async () => {
    await expect(vueloService.createVuelo({ ...vueloOk, fecha_hora: '2020-01-01T10:00' }))
      .rejects.toThrow('No se pueden cargar vuelos en el pasado')
  })
})