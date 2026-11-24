import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import vueloService from '../src/services/vuelos.js'

setActivePinia(createPinia())

// la validación corre antes del pedido: si falla, nunca llega a Supabase
const vueloOk = { numero: 'AR1520', tipo: 'partida', origen_destino: 'Córdoba', fecha_hora: '2026-11-24T10:30' }

describe('validación de vuelos', () => {
  it('rechaza un número de vuelo demasiado largo', async () => {
    await expect(vueloService.createVuelo({ ...vueloOk, numero: 'ADASDASDASDASD' }))
      .rejects.toThrow('de 3 a 8 letras o números')
  })

  it('rechaza una ciudad de más de 40 caracteres', async () => {
    await expect(vueloService.createVuelo({ ...vueloOk, origen_destino: 'x'.repeat(41) }))
      .rejects.toThrow('hasta 40 caracteres')
  })
})