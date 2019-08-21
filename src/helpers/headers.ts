import { isPlainObject, deepMerge } from './utils'
import { Methods } from '../types'

/**
 * 标准化header的健值，使其统一符合规范
 * @param headers request请求的header
 * @param normalizedName header中的健值名
 */
export function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }

  // 通过Object.keys获取对象中的所有key值，再通过forEach遍历循环每一个key
  Object.keys(headers).forEach((key: string): void => {
    // 判断当前的header的key和对比的heade的key不相同，且两者转为小写后两者皆相同
    if (key !== normalizedName && key.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[key]
      delete headers[key]
    }
  })
}

/**
 * 根据data数据的类型，设置request的header
 * @param headers request的header
 * @param data POST等请求携带的data数据
 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json; charset=utf-8'
    }
  }

  return headers
}

/**
 * 将响应的数据头信息字符串转为JSON对象格式
 * @param headers 响应的数据头信息字符串
 */
export function parseHeaders(headers: string): any {
  let parsed: any = Object.create(null)

  if (!headers) {
    return parsed
  }

  // 每一个是通过\r\n来进行换行的，所以通过这个分割
  headers.split('\r\n').forEach((line: string): void => {
    // 分割成键值对
    let [key, ...vals] = line.split(':')
    // key值转为小写
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }

    let val = vals.join(':').trim()

    parsed[key] = val
  })

  return parsed
}

/**
 * 扁平化合并headers里的所有配置项
 * @param headers request请求里的config的headers
 * @param method request请求里的method方法
 */
export function flattenHeaders(headers: any, method: Methods): any {
  if (!headers) {
    return headers
  }

  // 扁平化合并headers里的所有配置项
  // 第一个是深度拷贝公共的headers，第二个是深度拷贝对应请求特有的，第三个是深度拷贝直接写在headers里的
  headers = deepMerge(headers.common, headers[method], headers)

  /**
   * 需要删除的headers里的key值
   */
  const methodsToDelete: string[] = [
    'delete',
    'get',
    'head',
    'options',
    'post',
    'put',
    'patch',
    'common'
  ]
  // 删除不必要的headers里的键值对
  methodsToDelete.forEach(key => {
    delete headers[key]
  })

  return headers
}
