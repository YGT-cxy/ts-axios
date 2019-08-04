import { isPlainObject } from './utils'

/**
 * 标准化header的健值，使其统一符合规范
 * @param headers request请求的header
 * @param normalizedName header中的健值名
 */
export function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach((key: string): void => {
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
      headers['Content-Type'] = 'application/json;charsert=utf-8'
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
    let [key, val] = line.split(':')
    // key值转为小写
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }

    if (val) {
      val = val.trim()
    }

    parsed[key] = val
  })

  return parsed
}
