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
  /** 网络请求根域名 */
  baseURL?: string
  /**
   * 网络请求的地址
   */
  url?: string
  /**
   * 请求的方式
   */
  method?: Methods
  /**
   * xhr.send中携带的data数据，只能用于post、put、patch请求
   */
  data?: any
  /**
   * params参数，用于get等请求，拼接在url后面
   */
  params?: any
  /**
   * request的header
   */
  headers?: any
  /**
   * 响应的数据格式
   */
  responseType?: XMLHttpRequestResponseType
  /**
   * 是否设置超时时间，0为不设置超时时间
   */
  timeout?: number

  /**
   * 允许在请求数据发送到服务器之前对其进行更改
   * 这只适用于请求方法’PUT’，’POST’和’PATCH’
   */
  transformRequest?: AxiosTransformer | AxiosTransformer[]

  /**
   * 允许在 then / catch之前对响应数据进行更改
   */
  transformResponse?: AxiosTransformer | AxiosTransformer[]

  /**
   * 取消异步请求的实例
   */
  cancelToken?: CancelToken

  /** 是否发送跨域的 */
  withCredentials?: boolean

  /** XSRF的cookie的name */
  xsrfCookieName?: string

  /** XSRF发送的header的name */
  xsrfHeaderName?: string

  /** 监听下载的进度事件 */
  onDownloadProgress?: (e: ProgressEvent) => void

  /** 监听上传的进度事件 */
  onUploadProgress?: (e: ProgressEvent) => void

  /** http授权 */
  auth?: AxiosBasicCredentials

  /** 合法状态码 */
  validateStatus?: (status: number) => boolean

  /** params处理函数 */
  paramsSerializer?: (params: any) => string

  // 签名
  [propName: string]: any
}

/**
 * 响应数据体格式
 */
export interface AxiosResponse<T = any> {
  /**
   * 响应的data数据
   */
  data: T
  /**
   * 响应的状态码
   */
  status: number
  /**
   * response响应的数据文本
   */
  statusText: string
  /**
   * response的返回的header
   */
  headers: any
  /**
   * request请求的config配置项
   */
  config: AxiosRequestConfig
  /**
   * request实例本身
   */
  request: any
}

/**
 * 返回一个Promsie对象
 */
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

/**
 * 定义reques请求的Error
 */
export interface AxiosError extends Error {
  /**
   * 是否为Axios的报错
   */
  isAxiosError: boolean
  /**
   * request请求的config配置项
   */
  config: AxiosRequestConfig
  /**
   * 响应的错误状态码
   */
  code?: string | null
  /**
   * request实例本身
   */
  request?: any
  /**
   * 响应体
   */
  response?: AxiosResponse
}

/**
 * Axios的方法接口
 */
export interface Axios {
  /**
   * 默认配置项
   */
  defaults: AxiosRequestConfig

  /**
   * 拦截器
   */
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  /**
   * 发起request请求，是其他方式的请求的基础
   * @param config 请求的config配置项
   */
  request<T = any>(url: any, config?: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

/**
 * Axios对外使用的接口，继承Axios接口
 */
export interface AxiosInstance extends Axios {
  // 利用重载
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

/** Axios类接口 */
export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

/**
 * Axios的静态方法
 */
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (val: any) => boolean

  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}

/**
 * 拦截器的泛型接口
 */
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

/**
 * 拦截器的resolve接口
 */
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

/**
 * 拦截器的reject接口
 */
export interface RejectedFn {
  (error: any): any
}

/**
 * config和响应数据的处理
 */
export interface AxiosTransformer {
  (data: any, headers?: any): any
}

/**
 * 取消请求的实例类型接口定义
 */
export interface CancelToken {
  /**
   * 返回的promise对象，以便于异步操作中执行，修改状态
   */
  promise: Promise<Cancel>
  /**
   * 取消异步的理由
   */
  reason?: Cancel

  /**
   * 判断当前的CancelToken是否已经被使用
   */
  throwIfRequested(): void
}

/**
 * 取消方法的接口定义
 */
export interface Canceler {
  /** 取消时传入的原因 */
  (message?: string): void
}

/**
 * 取消异步请求的类构造函数参数的接口定义
 */
export interface CancelExecutor {
  /** 传入的方法 */
  (cancel: Canceler): void
}

/** CancelTokenStatic静态方法的返回值类型 */
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

/** CancelToken的类类型 */
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  /** 取消异步请求的静态方法 */
  source(): CancelTokenSource
}

/** Cancel实例类型接口 */
export interface Cancel {
  /** 原因 */
  message?: string
}

/** Cancel类类型的接口定义 */
export interface CancelStatic {
  new (message?: string): Cancel
}

/** http授权 */
export interface AxiosBasicCredentials {
  username: string
  password: string
}
