   import { createApp } from 'vue'
   import pinia from './stores/piniaState.js'

   import App from './App.vue'
   import './style.css'

   createApp(App)
       .use(pinia)
       .mount('#app')