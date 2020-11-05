import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'el-icon-s-home' }
    }]
  },
  {
    path: '/table',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Table',
      component: () => import('@/views/table/index'),
      meta: { title: 'Table', icon: 'el-icon-edit-outline' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'el-icon-edit-outline', roles: ['admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

// const router = new VueRouter({
//   base: process.env.BASE_URL,
//   routes
// })

const createRouter = () => new VueRouter({
  scrollBehavior: () => ({ y: 0 }), // 路由
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
