import { transformRequest, transformResponse } from './../../src/helpers/data'

describe('helpers:data', () => {
  describe('transformRequest', () => {
    test('如果数据是纯对象，应该将请求数据转换为字符串', () => {
      const a = { a: 1 }
      expect(transformRequest(a)).toBe('{"a":1}')
    })

    test('如果数据不是一个纯对象，应该什么都不做', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('transformResponse', () => {
    test('如果数据是JSON字符串，应该将响应数据转换为对象', () => {
      const a = '{"a": 2}'

      expect(transformResponse(a)).toEqual({ a: 2 })
    })

    test('如果数据是字符串而不是JSON字符串，应该什么都不做', () => {
      const a = '{a: 2}'
      expect(transformResponse(a)).toBe('{a: 2}')
    })

    test('如果数据不是字符串，应该什么都不做', () => {
      const a = { a: 2 }
      expect(transformResponse(a)).toBe(a)
    })
  })
})
