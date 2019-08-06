import { AxiosPromise, AxiosRequestConfig, Methods } from './../types'
import dispatchRequest from './dispatchRequest'

// Axios实现类
export default class Axios {
  // request方法，其他方式的请求即是通过这个方法实现
  request(url: any, config?: any): AxiosPromise {
    // url 为 字符串时，说明是request请求的url，将url赋值到config的url
    if (typeof url === 'string') {
      // 如果config没有传入，则设置config为对象，使用axios里的默认值
      if (!config) {
        config = {}
      }
      config.url = url

      // url 为 对象时，这时的url等同于config
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  // GET请求
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  // DELETE请求
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  // HEAD请求
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  // OPTIONS请求
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  // POST请求
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._reqeustMethodWithData('post', url, data, config)
  }

  // PUT请求
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._reqeustMethodWithData('put', url, data, config)
  }

  // PATCH请求
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._reqeustMethodWithData('patch', url, data, config)
  }

  // 封装get、delete、head、options请求方法中的公共部分，返回一个request方法
  _requestMethodWithoutData(
    method: Methods,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return dispatchRequest(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  // 封装post、put、patch请求方法中的公共部分，返回一个request方法
  _reqeustMethodWithData(
    method: Methods,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return dispatchRequest(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
