import axios from '../src/index'
import { getAjaxRequest } from './helper'

/** 测试header里是否存在某个值 */
function testHeaderValue(headers: any, key: string, val?: string): void {
  let found = false
  for (let k in headers) {
    if (k.toLowerCase() === key.toLowerCase()) {
      found = true
      expect(headers[k]).toBe(val)
      break
    }
  }

  if (!found) {
    if (typeof val === 'undefined') {
      expect(headers.hasOwnProperty(key)).toBeFalsy()
    } else {
      console.log(headers)
      throw new Error(key + ' was not found in headers')
    }
  }
}

describe('headers', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('使用默认的公共头文件', () => {
    const headers = axios.defaults.headers.common

    axios('/foo')

    return getAjaxRequest().then(request => {
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          expect(request.requestHeaders[key]).toEqual(headers[key])
        }
      }
    })
  })

  test('为post请求添加额外的header', () => {
    axios.post('/foo', 'fizz=buzz')

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded')
    })
  })

  test('数据为空，应该删除content-type', () => {
    axios.post('/foo')

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })

  it('如果数据为假，应该保留content-type', () => {
    axios.post('/foo', false)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded')
    })
  })

  test('数据是FormData，应该删除content-type', () => {
    const data = new FormData()
    data.append('foo', 'bar')

    axios.post('/foo', data)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })

  test('如果是对象，应该使用application/json', () => {
    axios.post('/foo/bar', {
      firstName: 'foo',
      lastName: 'bar'
    })

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/json; charset=utf-8')
    })
  })
})
