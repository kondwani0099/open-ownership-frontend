import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import ApplicantDashboard from '@/views/ApplicantDashboard.vue'
import ReviewerQueue from '@/views/ReviewerQueue.vue'
import ApplicationDetail from '@/views/ApplicationDetail.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginPage, meta: { guest: true } },
  { path: '/applicant', name: 'ApplicantDashboard', component: ApplicantDashboard, meta: { role: 'applicant' } },
  { path: '/reviewer', name: 'ReviewerQueue', component: ReviewerQueue, meta: { role: 'reviewer' } },
  { path: '/applications/:id', name: 'ApplicationDetail', component: ApplicationDetail, meta: { auth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  if (to.meta.guest) {
    // Already logged in → redirect to role dashboard
    if (token && user) {
      return next(user.role === 'reviewer' ? '/reviewer' : '/applicant')
    }
    return next()
  }

  if (!token) {
    return next('/login')
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    return next(user?.role === 'reviewer' ? '/reviewer' : '/applicant')
  }

  next()
})

export default router
