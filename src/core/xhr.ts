import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './../types/index'
import { parseHeaders } from './../helpers/headers'
import { createError } from './../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    // 解构赋值
    const { url, method = 'get', data = null, headers, responseType, timeout } = config
    const request = new XMLHttpRequest()

    // 设置响应数据的格式
    if (responseType) {
      request.responseType = responseType
    }

    // 判断是否设置了超时时间
    if (timeout) {
      request.timeout = timeout
    }

    // 根据响应的状态码，执行不同的逻辑
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        // reject(new Error(`Request failed with status code ${response.status}`))
        reject(
          createError({
            message: `Request failed with status code ${response.status}`,
            config,
            code: null,
            request,
            response
          })
        )
      }
    }

    // 打开request请求
    request.open(method.toUpperCase(), url!)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }

      if (request.status === 0) {
        return
      }

      // console.log(request.getAllResponseHeaders())
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())

      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }

      // resolve(response)
      handleResponse(response)
    }

    // 网络出错
    request.onerror = function handleError() {
      // reject(new Error('Network Error'))
      reject(
        createError({
          message: 'Network Error',
          config,
          code: null,
          request
        })
      )
    }

    // 请求超时
    request.ontimeout = function handleTimeout() {
      // reject(new Error(`Timeout of ${timeout} ms exceeded`))
      reject(
        createError({
          message: `Timeout of ${timeout} ms exceeded`,
          config,
          code: 'ECONNABORTED',
          request
        })
      )
    }

    // 给XMLHttpRequest请求添加header
    Object.keys(headers).forEach((key: string): void => {
      // 处理不传入data对content-type的处理，因为没有data数据，所以可以不需要传这个header
      if (!data && key.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(key, headers[key])
        request.setRequestHeader('content', '56552134')
      }
    })

    // 发送请求
    request.send(data)
  })
}
