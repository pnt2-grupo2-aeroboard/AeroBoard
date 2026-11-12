import api from "./api.js";

const API_ENDPOINT = "/rest/v1/vuelos"

export const TIPOS = ["arribo", "partida"]
export const ESTADOS = ["a horario", "demorado", "embarcando", "cancelado"]
export const AEROPUERTOS = ["AEP", "EZE"]

const normalize = (vuelo) => ({
  numero: String(vuelo.numero ?? "").trim().toUpperCase(),
  aerolinea: String(vuelo.aerolinea ?? "Aerolíneas Argentinas").trim(),
  tipo: vuelo.tipo,
  origen_destino: String(vuelo.origen_destino ?? "").trim(),
  fecha_hora: vuelo.fecha_hora || null,
  puerta: vuelo.puerta?.trim() || null,
  estado: vuelo.estado || "a horario",
  aeropuerto: vuelo.aeropuerto || "AEP",
})

const validate = (vuelo) => {
  const errors = []
  if (!vuelo.numero) errors.push("Debe tener un número de vuelo")
  if (!TIPOS.includes(vuelo.tipo)) errors.push("El tipo debe ser arribo o partida")
  if (!vuelo.origen_destino) errors.push("Debe tener origen o destino")
  if (!vuelo.fecha_hora) errors.push("Debe tener fecha y hora")
  if (!ESTADOS.includes(vuelo.estado)) errors.push("Estado inválido")
  if (!AEROPUERTOS.includes(vuelo.aeropuerto)) errors.push("Aeropuerto inválido")
  return errors
}

const prepareVuelo = (vuelo) => {
  const data = normalize(vuelo)
  const errors = validate(data)
  if (errors.length) throw new Error(errors.join(". "))
  return data
}

const HEADER_ROWS = { Prefer: "return=representation" }

const vueloService = {
  async fetchVuelos() {
    const { data } = await api.get(API_ENDPOINT, {
      params: { select: "*", order: "fecha_hora.asc" }
    })
    return data
  },
  async createVuelo(vuelo) {
    const { data } = await api.post(API_ENDPOINT, prepareVuelo(vuelo), { headers: HEADER_ROWS })
    return data[0]
  },
  async editVuelo(id, vuelo) {
    const { data } = await api.patch(API_ENDPOINT, prepareVuelo(vuelo), {
      params: { id: `eq.${id}` },
      headers: HEADER_ROWS
    })
    if (!data.length) throw new Error("No se actualizó el vuelo")
    return data[0]
  },
  async deleteVuelo(id) {
    const { data } = await api.delete(API_ENDPOINT, {
      params: { id: `eq.${id}` },
      headers: HEADER_ROWS
    })
    if (!data.length) throw new Error("No se encontró el vuelo para borrar")
    return data[0]
  }
}

export default vueloService