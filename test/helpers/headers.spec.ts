import {
  normalizeHeaderName,
  processHeaders,
  parseHeaders,
  flattenHeaders
} from './../../src/helpers/headers'

describe('helpers:headers', () => {
  /** 标准化header的健值，使其统一符合规范 */
  describe('normalizeHeaderName', () => {
    test('Content-Type', () => {
      const header = {
        'content-type': 'test'
      }
      const normalizedName = 'Content-Type'

      normalizeHeaderName(header, normalizedName)

      expect(header).toEqual({
        'Content-Type': 'test'
      })
    })
  })

  /** 根据data数据的类型，设置request的header */
  describe('processHeaders', () => {
    test('测试data数据为json对象，header里会不会添加Content-Type', () => {
      const header: any = {}
      processHeaders(header, { a: 1 })

      expect(header['Content-Type']).not.toBeUndefined()
      expect(header['Content-Type']).toBe('application/json; charset=utf-8')
    })

    test('如果没有设置内容类型，并且数据不是纯对象，应该不设置Content-Type', () => {
      const headers: any = {}
      processHeaders(headers, new URLSearchParams('a=b'))
      expect(headers['Content-Type']).toBeUndefined()
    })

    test('undefined or null，返回的应该是作为第一个传入的参数', () => {
      expect(processHeaders(undefined, {})).toBeUndefined()
      expect(processHeaders(null, {})).toBeNull()
    })
  })

  /** 将响应的数据头信息字符串转为JSON对象格式 */
  describe('parseHeaders', () => {
    test('解析响应的headers', () => {
      const parsed = parseHeaders(
        'Content-Type: application/json\r\n' +
          'Connection: keep-alive\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          ':aa\r\n' +
          'key:'
      )

      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe('')
    })

    test('空字符串，应该返回一个空的对象', () => {
      expect(parseHeaders('')).toEqual({})
    })
  })
  /** 扁平化合并headers里的所有配置项 */
  describe('flattenHeaders', () => {
    test('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
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

      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
    })

    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        }
      }

      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(flattenHeaders(undefined, 'get')).toBeUndefined()
      expect(flattenHeaders(null, 'post')).toBeNull()
    })
  })
})
