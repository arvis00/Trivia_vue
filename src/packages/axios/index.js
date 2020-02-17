import axios from 'axios'
import cookie from '@/packages/vue-cookie'

const http = axios.create({
  baseURL: 'https://opentdb.com'
})

http.interceptors.request.use(
  config => {
    if (cookie.get('session')) {
      config.params = {
        ...config.params,
        token: cookie.get('session')
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default http
