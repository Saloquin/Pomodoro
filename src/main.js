import './assets/main.css'
import './assets/fontawesome.min.css'

import { createApp } from 'vue/dist/vue.esm-bundler.js'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
