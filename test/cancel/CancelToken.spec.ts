import CancelToken from './../../src/cancel/CancelToken'
import Cancel, { isCancel } from './../../src/cancel/Cancel'
import { Canceler } from './../../src/types/index'

describe('CancelToken', () => {
  // 测试请求取消的原因
  describe('reason', () => {
    test('reason', () => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })

      // 执行取消请求的方法
      cancel!('已取消的操作')
      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe('已取消的操作')
    })

    test('多次取消通话应该没有副作用', () => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })

      cancel!('已取消的操作')
      cancel!('已取消的操作')

      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe('已取消的操作')
    })

    test('如果没有请求取消，返回值是否应该未定义', () => {
      const token = new CancelToken(() => {
        // do nothing
      })

      expect(token.reason).toBeUndefined()
    })
  })

  // 测试利用Promise实现异步回调执行resolve取消请求
  describe('promise', () => {
    test('应该返回一个在请求取消时解析的承诺', () => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })

      token.promise.then(value => {
        expect(value).toEqual(expect.any(Cancel))
        expect(value.message).toBe('取消请求操作')
      })

      cancel!('取消请求操作')
    })
  })

  describe('throwIfRequested', () => {
    test('如果取消请求，应该抛出异常', () => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })

      cancel!('取消请求操作')
      try {
        token.throwIfRequested()
        fail('希望测试抛出异常')
      } catch (e) {
        if (!isCancel(e)) {
          fail('期望测试是抛出取消异常Cancel类，但测试抛出 ' + e + '.')
        }
        expect(e.message).toBe('取消请求操作')
      }
    })

    test('如果没有请求取消，应该不会抛出', () => {
      const token = new CancelToken(() => {
        // do nothing
      })
      token.throwIfRequested()
    })
  })

  describe('source', () => {
    test('应该返回一个包含令牌和cancel函数的对象', () => {
      const source = CancelToken.source()
      expect(source.token).toEqual(expect.any(CancelToken))
      expect(source.cancel).toEqual(expect.any(Function))
      expect(source.token.reason).toBeUndefined()
      source.cancel('取消请求操作')
      expect(source.token.reason).toEqual(expect.any(Cancel))
      expect(source.token.reason!.message).toBe('取消请求操作')
    })
  })
})
