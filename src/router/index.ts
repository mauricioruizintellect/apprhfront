import { createRouter, createWebHistory } from 'vue-router'

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
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
    {
      path: '/admin',
      name: 'Admin Dashboard',
      component: () => import('../views/Admin/AdminDashboard.vue'),
      meta: {
        title: 'Administración',
      },
    },
    {
      path: '/portal',
      name: 'Internal portal',
      component: () => import('../views/Internal/InternalDashboard.vue'),
      meta: {
        title: 'Portal Interno',
      },
    },
    {
      path: '/consultores',
      name: 'Consultores',
      component: () => import('../views/Internal/ConsultantsPage.vue'),
      meta: {
        title: 'Consultores',
      },
    },
    {
      path: '/vacaciones',
      name: 'Solicitud Vacaciones',
      component: () => import('../views/Internal/VacationsPage.vue'),
      meta: {
        title: 'Solicitud Vacaciones',
      },
    },
    {
      path: '/horas-extras',
      name: 'Horas Extras',
      component: () => import('../views/Internal/OvertimePage.vue'),
      meta: {
        title: 'Horas Extras',
      },
    },
    {
      path: '/evaluaciones',
      name: 'Evaluaciones',
      component: () => import('../views/Internal/EvaluationsPage.vue'),
      meta: {
        title: 'Evaluaciones',
      },
    },

    {
      path: '/',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `StaffManager - ${to.meta.title}`

  const storedUser = sessionStorage.getItem('user')
  let role = null
  if (storedUser) {
    try {
      role = JSON.parse(storedUser).role
    } catch (error) {
      console.warn('No se pudo leer el rol del usuario:', error)
    }
  }

  const isSignin = to.path === '/'
  const accessToken = sessionStorage.getItem('accessToken')

  if (!isSignin && !accessToken) {
    next('/')
    return
  }

  if (to.path === '/consultores' && role === 'consultor') {
    next('/portal')
    return
  }

  next()
})
