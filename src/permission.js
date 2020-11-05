import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 页面切换进度条配置

const whiteList = ['/login'] // 路由白名单

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // start progress bar 进度条开始
  NProgress.start()

  // set page title 设置浏览器tag标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in 获取token
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') { // 如果有token，但是要跳转到登录页，重定向回layout页
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else { // 有token 去其他页面
      const hasRoles = store.getters.roles && store.getters.roles.length > 0 // 获取角色
      if (hasRoles) { //  如果有角色 继续执行
        next()
      } else { // 没有角色
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo') // 去获取用户信息
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else { // 没有权限
    if (whiteList.indexOf(to.path) !== -1) { // 去登录页
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`) // 重定向到登录页 带参数 - 要跳转的页面路径
      NProgress.done()
    }
  }
})

// 全局后置钩子
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
