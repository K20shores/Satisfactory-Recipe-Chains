import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Test from './views/Test.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/test', component: Test },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

export default router