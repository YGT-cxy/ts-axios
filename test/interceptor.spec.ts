import axios, { AxiosResponse } from './../src/index'
import { getAjaxRequest } from './helper'

describe('interceptor', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('添加请求拦截器', () => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.headers.test = 'added by interceptor'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test).toBe('added by interceptor')
    })
  })

  test('添加一个返回新配置对象的请求拦截器', () => {
    const instance = axios.create()

    instance.interceptors.request.use(() => {
      return {
        url: '/bar',
        method: 'post'
      }
    })

    instance('foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('POST')
      expect(request.url).toBe('/bar')
    })
  })

  test('添加一个返回承诺的请求拦截器', done => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      return new Promise(resolve => {
        setTimeout(() => {
          config.headers.async = 'promise'
          resolve(config)
        }, 10)
      })
    })

    instance('/foo')

    setTimeout(() => {
      getAjaxRequest().then(request => {
        expect(request.requestHeaders.async).toBe('promise')
        done()
      })
    }, 100)
  })

  test('添加多个请求拦截器', () => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.headers.test1 = '1'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test2 = '2'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test3 = '3'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test1).toBe('1')
      expect(request.requestHeaders.test2).toBe('2')
      expect(request.requestHeaders.test3).toBe('3')
    })
  })

  test('添加响应拦截器', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + ' - modified by interceptor'
      return data
    })

    instance('/foo').then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('OK - modified by interceptor')
        done()
      }, 100)
    })
  })

  test('添加一个返回新数据对象的响应拦截器', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(() => {
      return {
        data: 'stuff',
        headers: null,
        status: 500,
        statusText: 'ERR',
        request: null,
        config: {}
      }
    })

    instance('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('stuff')
        expect(response.headers).toBeNull()
        expect(response.status).toBe(500)
        expect(response.statusText).toBe('ERR')
        expect(response.request).toBeNull()
        expect(response.config).toEqual({})
        done()
      }, 100)
    })
  })

  test('添加一个返回承诺的响应拦截器', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      return new Promise(resolve => {
        // do something async
        setTimeout(() => {
          data.data = 'you have been promised!'
          resolve(data)
        }, 10)
      })
    })

    instance('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('you have been promised!')
        done()
      }, 100)
    })
  })

  test('添加多个响应拦截器', done => {
    let response: AxiosResponse
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + '1'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '3'
      return data
    })

    instance('/foo').then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('OK123')
        done()
      }, 100)
    })
  })

  test('允许移除拦截器', done => {
    let response: AxiosResponse
    let intercept
    const instance = axios.create()

    instance.interceptors.response.use(data => {
      data.data = data.data + '1'
      return data
    })
    intercept = instance.interceptors.response.use(data => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '3'
      return data
    })

    instance.interceptors.response.eject(intercept)
    instance.interceptors.response.eject(5)

    instance('/foo').then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('OK13')
        done()
      }, 100)
    })
  })
})
