import { CancelExecutor, CancelTokenSource, Canceler } from './../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

/** 取消异步请求 */
export default class CancelToken {
  /** 存放取消异步请求的方法 */
  promise: Promise<Cancel>
  /** 存放取消异步请求实例 */
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    // 定义一个变量，接受异步Promise里的resolve到外部
    let resolvePromise: ResolvePromise

    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    /** 取消异步请求 */
    executor(message => {
      // 判断该异步请求是否已经执行，已执行则不再执行下面的代码
      if (this.reason) {
        return
      }

      // 创建取消异步请求的类
      this.reason = new Cancel(message)
      // 执行Promise的resolve，触发放在异步请求中的取消请求函数
      resolvePromise(this.reason)
    })
  }

  /**
   * 判断当前的异步是否已经被使用
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  /**
   * 静态方法：第二种取消异步的方法
   */
  static source(): CancelTokenSource {
    /** 执行取消异步的方法 */
    let cancel!: Canceler
    /** 取消异步实例 */
    const token = new CancelToken(c => {
      cancel = c
    })

    return {
      cancel,
      token
    }
  }
}
