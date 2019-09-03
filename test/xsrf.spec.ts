import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('xsrf', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
    document.cookie =
      axios.defaults.xsrfCookieName + '=;expires=' + new Date(Date.now() - 86400000).toUTCString()
  })

  test('如果cookie为空，不应该设置xsrf头文件', () => {
    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('如果设置了cookie，应该设置xsrf头文件', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=12345'

    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('12345')
    })
  })

  test('不应该为cross origin设置xsrf头文件', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=12345'

    axios('http://example.com/')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('当与凭证一起使用时，应该为cross origin设置xsrf头文件', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=12345'

    axios('http://example.com/', {
      withCredentials: true
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('12345')
    })
  })
})
