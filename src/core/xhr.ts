import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './../types/index'
import { parseHeaders } from './../helpers/headers'
import { createError } from './../helpers/error'
import { isURLSameOrigin } from './../helpers/url'
import cookie from './../helpers/cookie'
import { isFormData } from './../helpers/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    // 解构赋值
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth
    } = config
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

    // 设置withCredentials跨越请求
    if (withCredentials) {
      request.withCredentials = withCredentials
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

    // 添加监听下载进度的事件
    if (onDownloadProgress) {
      request.onprogress = onDownloadProgress
    }

    // 添加监听上传进度的事件
    if (onUploadProgress) {
      request.upload.onprogress = onUploadProgress
    }

    // 判断reuqest的data类型，是FormData类型的对象数据，则删除Content-Type的header头信息，让浏览器自行添加
    if (isFormData(data)) {
      delete headers['Content-Type']
    }

    // 是否发送xsrf
    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = cookie.read(xsrfCookieName)
      if (xsrfValue && xsrfHeaderName) {
        headers[xsrfHeaderName] = xsrfValue
      }
    }

    // http授权
    if (auth) {
      headers['Authorization'] = 'Basic ' + btoa(`${auth.username}:${auth.password}`)
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

    // 异步请求中取消请求
    if (cancelToken) {
      // 执行cancelToken异步Promise，修改状态，触发取消异步请求的功能
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }

    // 发送请求
    request.send(data)
  })
}
