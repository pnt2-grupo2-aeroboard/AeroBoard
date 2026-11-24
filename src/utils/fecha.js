export const claveDia = (fechaHora) => new Date(fechaHora).toLocaleDateString('sv-SE')


export const etiquetaDia = (fechaHora) => {
  const clave = claveDia(fechaHora)
  const hoy = new Date()
  const dia = (offset) => {
    const d = new Date(hoy)
    d.setDate(d.getDate() + offset)
    return d.toLocaleDateString('sv-SE')
  }
  if (clave === dia(0)) return 'Hoy'
  if (clave === dia(1)) return 'Mañana'
  if (clave === dia(-1)) return 'Ayer'
  return new Date(fechaHora).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

export const ahoraParaInput = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}