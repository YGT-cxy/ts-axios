import axios, { AxiosTransformer } from './../src/index'
import { getAjaxRequest } from './helper'
import { deepMerge } from './../src/helpers/utils'

describe('defaults', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('请求转换JSON', () => {
    expect((axios.defaults.transformRequest as AxiosTransformer[])[0]({ foo: 'bar' })).toBe(
      '{"foo":"bar"}'
    )
  })

  test('reqeust请求字符串不进行转换处理', () => {
    expect((axios.defaults.transformRequest as AxiosTransformer[])[0]('foo=bar')).toBe('foo=bar')
  })

  test('转换响应的JSON', () => {
    const data = (axios.defaults.transformResponse as AxiosTransformer[])[0]('{"foo":"bar"}')

    expect(typeof data).toBe('object')
    expect(data.foo).toBe('bar')
    expect(data).toEqual({ foo: 'bar' })
  })

  test('响应为字符串不需要转换', () => {
    expect((axios.defaults.transformResponse as AxiosTransformer[])[0]('foo=bar')).toBe('foo=bar')
  })

  test('使用全局默认配置项', () => {
    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
    })
  })

  test('使用修改后的配置项', () => {
    axios.defaults.baseURL = 'http://example.com/'

    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://example.com/foo')
      delete axios.defaults.baseURL
    })
  })

  test('使用请求的配置项', () => {
    axios('/foo', {
      baseURL: 'http://www.example.com'
    })

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://www.example.com/foo')
    })
  })

  test('为自定义实例使用默认配置', () => {
    const instance = axios.create({
      xsrfCookieName: 'CUSTOM-XSRF-TOKEN',
      xsrfHeaderName: 'X-CUSTOM-XSRF-TOKEN'
    })
    document.cookie = instance.defaults.xsrfCookieName + '=foobarbaz'

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[instance.defaults.xsrfHeaderName!]).toBe('foobarbaz')
      document.cookie =
        instance.defaults.xsrfCookieName +
        '=;expires=' +
        new Date(Date.now() - 86400000).toUTCString()
    })
  })

  test('使用GET头信息', () => {
    axios.defaults.headers.get['X-CUSTOM-HEADER'] = 'foo'
    axios.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-CUSTOM-HEADER']).toBe('foo')
      delete axios.defaults.headers.get['X-CUSTOM-HEADER']
    })
  })

  test('使用POST头信息', () => {
    axios.defaults.headers.post['X-CUSTOM-HEADER'] = 'foo'
    axios.post('/foo', {})

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-CUSTOM-HEADER']).toBe('foo')
      delete axios.defaults.headers.post['X-CUSTOM-HEADER']
    })
  })

  test('使用config的headers', () => {
    const instance = axios.create({
      headers: {
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
    })

    instance.get('/foo', {
      headers: {
        'X-FOO-HEADER': 'fooHeaderValue',
        'X-BAR-HEADER': 'barHeaderValue'
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-COMMON-HEADER']).toBe('commonHeaderValue')
      expect(request.requestHeaders['X-GET-HEADER']).toBe('getHeaderValue')
      expect(request.requestHeaders['X-FOO-HEADER']).toBe('fooHeaderValue')
      expect(request.requestHeaders['X-BAR-HEADER']).toBe('barHeaderValue')
    })
  })

  test('如果在创建实例之前设置了自定义实例，是否应该使用它', () => {
    axios.defaults.baseURL = 'http://example.org/'
    const instance = axios.create()

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://example.org/foo')
      delete axios.defaults.baseURL
    })
  })

  test('如果在创建实例后设置自定义实例，则不应使用该实例', () => {
    const instance = axios.create()
    axios.defaults.baseURL = 'http://example.org/'

    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
    })
  })
})
