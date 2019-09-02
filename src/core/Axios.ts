import {
  AxiosPromise,
  AxiosRequestConfig,
  Methods,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from './../types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'
import { flattenHeaders } from './../helpers/headers'

// request和response拦截器对象接口
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

// 链式调用执行调用的接口
interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

// Axios实现类
export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    // 默认配置
    this.defaults = initConfig
    // 拦截器
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

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

    // 合并默认的config和自定义的config
    config = mergeConfig(this.defaults, config)
    // 将method大写的转为小写
    config.method = config.method.toLowerCase()

    // 拦截器
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    // 遍历request拦截器
    this.interceptors.request.forEachInterceptor(intercepror => {
      // 从后面执行到前面，先执行最后一个，往前执行
      // unshift 向数组的开头添加一个或更多元素，并返回新的长度
      chain.unshift(intercepror)
    })

    // 遍历response拦截器
    this.interceptors.response.forEachInterceptor(intercepror => {
      // 从前面执行到后面，按照注册的顺序，从第一个开始
      // push 向数组的末尾添加一个或更多元素，并返回新的长度
      chain.push(intercepror)
    })

    // 链式调用
    // 先执行最后一个注册的request处理函数，依次执行到第一个，然后执行xhr，xhr执行完毕后，执行的是response的处理函数，从第一个执行到最后一个
    // request处理函数 --> xhr --> response处理函数
    let promise = Promise.resolve(config)

    while (chain.length) {
      // shift 删除并返回数组的第一个元素
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    // 返回最后的响应数据，支持链式调用
    return promise
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
    return this.request(
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
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
