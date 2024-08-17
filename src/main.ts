import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify.ts'
import router from './router';
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"

createApp(App)
  .use(vuetify)
  .use(router)
  .use(VNetworkGraph)
  .mount('#app')