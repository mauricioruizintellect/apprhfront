import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
        requiresAuth: true,
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
        requiresAuth: true,
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
      meta: {
        title: 'Line Chart',
        requiresAuth: true,
      },
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
      meta: {
        title: 'Bar Chart',
        requiresAuth: true,
      },
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
        requiresAuth: true,
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
        requiresAuth: true,
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
        requiresAuth: true,
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
        requiresAuth: true,
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
        requiresAuth: true,
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
        requiresAuth: true,
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
        requiresAuth: true,
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
        requiresAuth: true,
      },
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: 'Unauthorized',
        requiresAuth: false,
      },
    },
    {
      path: '/admin',
      name: 'Admin Dashboard',
      component: () => import('../views/Admin/AdminDashboard.vue'),
      meta: {
        title: 'Administración',
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/portal',
      name: 'Internal portal',
      component: () => import('../views/Internal/InternalDashboard.vue'),
      meta: {
        title: 'Portal Interno',
        requiresAuth: true,
      },
    },
    {
      path: '/consultores',
      name: 'Consultores',
      component: () => import('../views/Internal/ConsultantsPage.vue'),
      meta: {
        title: 'Consultores',
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/vacaciones',
      name: 'Solicitud Vacaciones',
      component: () => import('../views/Internal/VacationsPage.vue'),
      meta: {
        title: 'Solicitud Vacaciones',
        requiresAuth: true,
      },
    },
    {
      path: '/horas-extras',
      name: 'Horas Extras',
      component: () => import('../views/Internal/OvertimePage.vue'),
      meta: {
        title: 'Horas Extras',
        requiresAuth: true,
      },
    },
    {
      path: '/evaluaciones',
      name: 'Evaluaciones',
      component: () => import('../views/Internal/EvaluationsPage.vue'),
      meta: {
        title: 'Evaluaciones',
        requiresAuth: true,
      },
    },
    {
      path: '/empleado/editar/:id',
      name: 'Editar empleado',
      component: () => import('../views/Internal/EditEmployee.vue'),
      meta: {
        title: 'Editar empleado',
        requiresAuth: true,
      },
    },
    {
      path: '/empleado/crear',
      name: 'Crear empleado',
      component: () => import('../views/Internal/NewEmployee.vue'),
      meta: {
        title: 'Crear empleado',
        requiresAuth: true,
      },
    },

    {
      path: '/',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      alias: '/login',
      meta: {
        title: 'Signin',
        requiresAuth: false,
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `StaffManager - ${to.meta.title}`

  const authStore = useAuthStore(pinia)

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (!to.meta.requiresAuth && authStore.isAuthenticated) {
    if (authStore.user?.role === 'admin') {
      next('/admin')
      return
    }
    next('/portal')
    return
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next('/portal')
    return
  }

  next()
})
