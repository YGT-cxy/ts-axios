import axios from './../src/index'
import { getAjaxRequest } from './helper'

describe('cancel', () => {
  const CancelToken = axios.CancelToken
  const Cancel = axios.Cancel

  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  describe('测试取消异步请求操作的方法', () => {
    test('在发送请求之前调用', () => {
      const source = CancelToken.source()
      source.cancel('取消请求操作')

      return axios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(reason => {
          // console.log(reason)
          expect(reason).toEqual(expect.any(Cancel))
          expect(reason.message).toBe('取消请求操作')
        })
    })
  })

  describe('请求发送后调用', () => {
    test('', () => {
      const source = CancelToken.source()

      axios
        .get('/foo/bar', {
          cancelToken: source.token
        })
        .catch(reason => {
          expect(reason).toEqual(expect.any(Cancel))
          expect(reason.message).toBe('取消异步请求')
        })

      getAjaxRequest().then(request => {
        source.cancel('取消异步请求')
        setTimeout(() => {
          request.respondWith({
            status: 200,
            responseText: 'OK'
          })
        }, 100)
      })
    })

    test('对请求对象的调用中止', done => {
      const source = CancelToken.source()
      let request: any
      axios
        .get('/foo/bar', {
          cancelToken: source.token
        })
        .catch(() => {
          expect(request.statusText).toBe('abort')
          done()
        })

      getAjaxRequest().then(req => {
        source.cancel()
        request = req
      })
    })
  })

  describe('在收到响应后调用', () => {
    test('不应该导致未经处理的拒绝', done => {
      const source = CancelToken.source()
      axios
        .get('/foo', {
          cancelToken: source.token
        })
        .then(() => {
          window.addEventListener('unhandledrejection', () => {
            done.fail('Unhandled rejection.')
          })
          source.cancel()
          setTimeout(done, 100)
        })

      getAjaxRequest().then(request => {
        request.respondWith({
          status: 200,
          responseText: 'OK'
        })
      })
    })
  })
})
