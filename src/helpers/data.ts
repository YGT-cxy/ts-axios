import { isPlainObject } from './utils'

/**
 * 判断对象是否为普通对象，如果是普通对象则转为JSON字符串，不是则直接返回对象
 * @param data 请求的data数据
 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    data = JSON.stringify(data)
  }
  return data
}

/**
 * 尝试转换响应的data数据为JSON对象格式
 * @param data 响应的data数据
 */
export function transformResponse(data: any): any {
  // TODO:可以不用try，判断data是否为JSON字符串
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch(e) {
      // do nothing
    }
  }

  return data
}
