// methods请求的方式
export type Methods =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'post'
  | 'POST'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

/**
 * reqeust请求配置
 */
export interface AxiosRequestConfig {
  url?: string // 请求的地址
  method?: Methods // 请求的方式
  data?: any // post等请求的data数据
  params?: any // params参数，用于get等请求，拼接在url后面
  headers?: any // request的header
  responseType?: XMLHttpRequestResponseType // 响应的数据格式
  timeout?: number // 是否设置超时时间，0为不设置超时时间

  [propName: string]: any
}

/**
 * 响应数据体格式
 */
export interface AxiosResponse {
  data: any // 响应的data数据
  status: number // 响应的状态码
  statusText: string // 响应的文本
  headers: any // 响应的header
  config: AxiosRequestConfig // request请求的config配置项
  request: any // request实例本身
}

/**
 * 返回一个Promsie对象
 */
export interface AxiosPromise extends Promise<AxiosResponse> {}

/**
 * 定义reques请求的Error
 */
export interface AxiosError extends Error {
  isAxiosError: boolean // 是否为Axios的报错
  config: AxiosRequestConfig // request请求的config配置项
  code?: string | null // 状态码
  request?: any // request实例本身
  response?: AxiosResponse // 响应体
}

// Axios的方法接口
export interface Axios {
  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request(config: AxiosRequestConfig): AxiosPromise

  get(url: string, config?: AxiosRequestConfig): AxiosPromise
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise
  head(url: string, config?: AxiosRequestConfig): AxiosPromise
  options(url: string, config?: AxiosRequestConfig): AxiosPromise

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
}

// Axios对外使用的接口
export interface AxiosInstance extends Axios {
  // 利用重载
  (config: AxiosRequestConfig): AxiosPromise

  (url: string, config?: AxiosRequestConfig): AxiosPromise
}

// 拦截器的接口
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

// 拦截器的resolve接口
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

// 拦截器的reject接口
export interface RejectedFn {
  (error: any): any
}
