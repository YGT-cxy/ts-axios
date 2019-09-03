import axios, { AxiosResponse, AxiosTransformer } from './../src/index'
import { getAjaxRequest } from './helper'

describe('transform', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('将JSON转为字符串', () => {
    const data = {
      foo: 'bar'
    }

    axios.post('/foo', data)

    return getAjaxRequest().then(request => {
      expect(request.params).toBe('{"foo":"bar"}')
    })
  })

  test('将字符串转为JSON', done => {
    let response: AxiosResponse

    axios('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"foo": "bar"}'
      })

      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.foo).toBe('bar')
        done()
      }, 100)
    })
  })

  test('覆盖默认转换', () => {
    const data = {
      foo: 'bar'
    }

    axios.post('/foo', data, {
      transformRequest(data) {
        return data
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.params).toEqual({ foo: 'bar' })
    })
  })

  test('允许一个转换器队列', () => {
    const data = {
      foo: 'bar'
    }

    axios.post('/foo', data, {
      transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(function(
        data
      ) {
        return data.replace('bar', 'baz')
      })
    })

    return getAjaxRequest().then(request => {
      expect(request.params).toBe('{"foo":"baz"}')
    })
  })

  test('允许更改标题', () => {
    const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36)

    axios('/foo', {
      transformRequest: (data, headers) => {
        headers['X-Authorization'] = token
        return data
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-Authorization']).toEqual(token)
    })
  })
})
