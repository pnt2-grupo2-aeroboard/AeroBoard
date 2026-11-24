import { createApp } from 'vue'
import pinia from './stores/piniaState.js'
import router from './router/index.js'

import App from './App.vue'
import './style.css'
import './pwa.js'

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')