import { createError } from './../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from './../../src/types'

describe('helpers:error', () => {
  test('应该使用消息、配置、代码、请求、响应和isAxiosError创建错误', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    }

    const error = createError({
      message: 'Boom!',
      config,
      code: 'SOMETHING',
      request,
      response
    })

    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('Boom!')
    expect(error.config).toBe(config)
    expect(error.code).toBe('SOMETHING')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
