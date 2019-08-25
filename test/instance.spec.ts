import axios, { AxiosResponse } from './../src/index'
import { getAjaxRequest } from './helper'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('发送http请求', () => {
    const instance = axios.create()

    instance('/foot')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foot')
    })
  })

  test('测试request请求-带两个参数', () => {
    axios.request('/request', {
      method: 'get'
    })

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/request')
      expect(request.method).toBe('GET')
    })
  })

  test('测试request请求-带一个参数', () => {
    axios.request({
      url: '/request',
      method: 'get'
    })

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/request')
      expect(request.method).toBe('GET')
    })
  })

  test('测试get请求', () => {
    const instance = axios.create()

    instance.get('/get')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/get')
      expect(request.method).toBe('GET')
    })
  })

  test('测试head请求', () => {
    const instance = axios.create()

    instance.head('/head')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/head')
      expect(request.method).toBe('HEAD')
    })
  })

  test('测试delete请求', () => {
    const instance = axios.create()

    instance.delete('/delete')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/delete')
      expect(request.method).toBe('DELETE')
    })
  })

  test('测试options请求', () => {
    const instance = axios.create()

    instance.options('/options')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/options')
      expect(request.method).toBe('OPTIONS')
    })
  })

  test('测试post请求', () => {
    const instance = axios.create()

    instance.post('/post', 'a=1')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/post')
      expect(request.method).toBe('POST')
      expect(request.requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded')
    })
  })

  test('测试put请求', () => {
    const instance = axios.create()

    instance.put('/put')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/put')
      expect(request.method).toBe('PUT')
    })
  })

  test('测试patch请求', () => {
    const instance = axios.create()

    instance.patch('/patch')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/patch')
      expect(request.method).toBe('PATCH')
    })
  })

  test('测试超时', () => {
    const instance = axios.create({
      timeout: 3000
    })

    instance.get('/get')

    return getAjaxRequest().then(request => {
      expect(request.timeout).toBe(3000)
    })
  })

  test('测试默认配置项的headers', () => {
    const instance = axios.create({ baseURL: 'https://api.example.com' })

    expect(typeof instance.defaults.headers).toBe('object')
    expect(typeof instance.defaults.headers.common).toBe('object')
  })

  test('实例是否有拦截器interceptors', done => {
    axios.interceptors.request.use(config => {
      config.timeout = 2000
      return config
    })

    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.timeout = 5000
      config.withCredentials = true
      return config
    })

    let response: AxiosResponse
    instance.post('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })

      setTimeout(() => {
        expect(response.config.timeout).toBe(5000)
        expect(response.config.withCredentials).toBeTruthy()
        done()
      }, 1000)
    })
  })
})
