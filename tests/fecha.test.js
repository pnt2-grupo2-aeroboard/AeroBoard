import { describe, it, expect } from 'vitest'
import { etiquetaDia, claveDia } from '../src/utils/fecha.js'

describe('fechas de los vuelos', () => {
  it('muestra "Hoy" para un vuelo de hoy', () => {
    expect(etiquetaDia(new Date().toISOString())).toBe('Hoy')
  })

  it('agrupa por día con formato año-mes-día', () => {
    expect(claveDia('2026-11-26T10:30')).toBe('2026-11-26')
  })
})