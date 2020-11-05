import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const status = {
  0: '请求超时，请检查网络是否断开或者链接是否正确',
  400: '错误的请求。由于语法错误，该请求无法完成。',
  401: '未经授权。服务器拒绝响应。',
  403: '已禁止。服务器拒绝响应。',
  404: '未找到。无法找到请求的位置。',
  405: '方法不被允许。使用该位置不支持的请求方法进行了请求。',
  406: '不可接受。服务器只生成客户端不接受的响应。',
  407: '需要代理身份验证。客户端必须先使用代理对自身进行身份验证。',
  408: '请求超时。等待请求的服务器超时。',
  409: '冲突。由于请求中的冲突，无法完成该请求。',
  410: '过期。请求页不再可用。',
  411: '长度必需。未定义“内容长度”。',
  412: '前提条件不满足。请求中给定的前提条件由服务器评估为 false。',
  413: '请求实体太大。服务器不会接受请求，因为请求实体太大。',
  414: '请求 URI 太长。服务器不会接受该请求，因为 URL 太长。',
  415: '不支持的媒体类型。服务器不会接受该请求，因为媒体类型不受支持。',
  416: 'HTTP 状态代码 {0}',
  500: '内部服务器错误。',
  501: '未实现。服务器不识别该请求方法，或者服务器没有能力完成请求。',
  503: '服务不可用。服务器当前不可用(过载或故障)。'
}

// 创建axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 配置baseURL
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout 超时时间
})

// 请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 判断返回响应值是否是错误的
    if (status[res.code]) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 判断响应是否是无权限进入
      if (res.code === 403) {
        // to re-login
        MessageBox.confirm('您没有权限进入', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
