import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'ai-assistant',
          name: 'ai-assistant',
          component: () => import('../views/AIAssistantView.vue'),
        },
        {
          path: 'contract-review',
          name: 'contract-review',
          component: () => import('../views/ContractAnalysisView.vue'),
        },
        {
          path: 'leads',
          name: 'leads',
          component: () => import('../views/LeadsView.vue'),
        },
        {
          path: 'leads/:id',
          name: 'lead-detail',
          component: () => import('../views/LeadDetailView.vue'),
        },
        {
          path: 'clients',
          name: 'clients',
          component: () => import('../views/ClientsView.vue'),
        },
        {
          path: 'clients/:id',
          name: 'client-detail',
          component: () => import('../views/ClientDetailView.vue'),
        },
        {
          path: 'matters',
          name: 'matters',
          component: () => import('../views/MattersView.vue'),
        },
        {
          path: 'matters/:id',
          name: 'matter-detail',
          component: () => import('../views/MatterDetailView.vue'),
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: () => import('../views/TasksView.vue'),
        },
        {
          path: 'tasks/:id',
          name: 'task-detail',
          component: () => import('../views/TaskDetailView.vue'),
        },
        {
          path: 'knowledge-base',
          name: 'knowledge-base',
          component: () => import('../views/KnowledgeBaseView.vue'),
        },
      ],
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

export default router
