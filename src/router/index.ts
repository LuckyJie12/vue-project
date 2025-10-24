import { createRouter, createWebHistory } from 'vue-router'
import ConsoleView from '@/views/ConsoleView.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/console',
      name: 'console',
      component: ConsoleView,
    },
    {
      path: '/analytics',
      name: 'home',
      component: AnalyticsView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
