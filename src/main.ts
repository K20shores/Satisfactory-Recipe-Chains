import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify.ts'

createApp(App).use(vuetify).mount('#app')