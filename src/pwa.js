import { registerSW } from 'virtual:pwa-register'

export const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Hay una versión nueva de AeroBoard')
  },
  onOfflineReady() {
    console.log('AeroBoard está lista para usarse sin internet')
  },
})