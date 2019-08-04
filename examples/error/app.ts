import axios from '../../src/index'
import { AxiosError } from './../../src/types'

// 404
axios({
  method: 'get',
  url: '/error/get1'
}).then((res): void => {
  console.log(res)
}).catch((e: AxiosError): void => {
  console.log(e)
})

axios({
  method: 'get',
  url: '/error/get'
}).then((res) => {
  console.log(res)
}).catch((e) => {
  console.log(e)
})

// 网络出错
setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  }).then((res) => {
    console.log(res)
  }).catch((e) => {
    console.log(e)
  })
}, 5000)

// 超时
axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
}).then((res) => {
  console.log(res)
}).catch((e) => {
  console.log(e.message)
  console.log(e.code)
})
