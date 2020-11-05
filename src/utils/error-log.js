import Vue from 'vue'
import store from '@/store'
import { isString, isArray } from '@/utils/validate'
import settings from '@/settings'

// 设置别名
const { errorLog: needErrorLog } = settings

// 检查是否需要开启错误日志
function checkNeed () {
  // 获取当前环境
  const env = process.env.NODE_ENV
  // 检测settings中设置是否符合规则
  if (isString(needErrorLog)) {
    // 如果是字符串  当前环境和设置环境是否一致
    return env === needErrorLog
  }
  // 检查settings中设置的是数组
  if (isArray(needErrorLog)) {
    // 如果是数组，判断当前环境是否在设置环境数组中
    return needErrorLog.includes(env)
  }
  return false
}

if (checkNeed()) {
  Vue.config.errorHandler = function (err, vm, info, a) {
    Vue.nextTick(() => {
      // 将错误信息存入 store
      store.dispatch('errorLog/addErrorLog', {
        err,
        vm,
        info,
        url: window.location.href
      })
      console.log(err, info)
    })
  }
}
