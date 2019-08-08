import { ResolvedFn, RejectedFn } from './../types'

// 拦截器的成功和失败处理函数
interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

// 定义一个拦截器对象，存放成功和失败的处理函数，注册相应的处理函数，取消注册相应的处理函数
export default class InterceptorManager<T> {
  // 定义拦截器容器
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  // 注册拦截器，并返回一个拦截器的ID
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })

    return this.interceptors.length - 1
  }

  // 遍历所有的拦截器，执行相应的方法
  forEachInterceptor(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        // 执行注册的拦截器
        fn(interceptor)
      }
    })
  }

  // 取消注册的拦截器
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
