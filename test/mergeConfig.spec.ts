import axios from './../src/index'
import mergeConfig from './../src/core/mergeConfig'

describe('mergeConfig', () => {
  const defaults = axios.defaults

  test('第二个参数接受undefined', () => {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults)
  })

  test('第二个参数接受对象', () => {
    expect(mergeConfig(defaults, {})).toEqual(defaults)
  })

  test('返回的对象是一个全新的对象', () => {
    const merged = mergeConfig(defaults, {})
    expect(merged).not.toBe(defaults)
    expect(merged.headers).not.toBe(defaults.headers)
  })

  test('设置请求的配置', () => {
    const config = {
      url: '__sample url__',
      params: '1234',
      data: {
        foo: true
      }
    }

    const merged = mergeConfig(defaults, config)

    expect(merged.url).toBe(config.url)
    expect(merged.params).toBe(config.params)
    expect(merged.data).toEqual(config.data)
    expect(merged).toEqual(merged)
  })

  test('不继承请求的配置项', () => {
    const localDefaults = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }
    const merged = mergeConfig(localDefaults, {})
    expect(merged.url).toBeUndefined()
    expect(merged.params).toBeUndefined()
    expect(merged.data).toBeUndefined()
  })

  test('传递config2时没有定义，应该返回默认的头文件', () => {
    expect(
      mergeConfig(
        {
          headers: 'x-mock-header'
        },
        undefined
      )
    ).toEqual({
      headers: 'x-mock-header'
    })
  })

  test('合并auth，报头与默认值', () => {
    expect(
      mergeConfig(
        {
          auth: undefined
        },
        {
          auth: {
            username: 'foo',
            password: 'test'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'foo',
        password: 'test'
      }
    })
    expect(
      mergeConfig(
        {
          auth: {
            username: 'foo',
            password: 'test'
          }
        },
        {
          auth: {
            username: 'baz',
            password: 'foobar'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'baz',
        password: 'foobar'
      }
    })
  })

  test('用非对象值覆盖auth、header', () => {
    expect(
      mergeConfig(
        {
          headers: {
            common: {
              Accept: 'application/json, text/plain, */*'
            }
          }
        },
        {
          headers: null
        }
      )
    ).toEqual({
      headers: null
    })
  })

  test('允许设置其他选项', () => {
    const merged = mergeConfig(defaults, {
      timeout: 123
    })
    expect(merged.timeout).toBe(123)
  })
})
