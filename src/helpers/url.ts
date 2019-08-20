import { isArray, isDate, isPlainObject, isURLSearchParams } from './utils'

/**
 * 定义获取url的里的信息接口
 */
interface URLOrigin {
  protocol: string
  host: string
}

/**
 * 将字符串进行encodeURIComponent编码，并处理一些不需要编码转义的字符
 * @param val 需要进行编码的字符串
 */
export const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 将url字符串和params参数对象拼接在一起，返回一个拼接后的字符串
 * @param url 被拼接的url字符串
 * @param params 需要拼接到url字符串后面的参数对象
 */
export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  // 不传入params参数直接返回url
  if (!params) {
    return url
  }

  let serializedParams: string

  // 判断是否有处理params的方法传入
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
    // params为URLSearchParams类型对象
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
    // 使用默认的处理规则
  } else {
    const parts: string[] = []

    // 遍历params对象里的所有键值对
    Object.keys(params).forEach((key: string): void => {
      const val: any = params[key]
      // 如果对象的值为null或undefined，则忽略跳过，不处理
      if (val === null || typeof val === 'undefined') {
        return
      }

      let values: any[] = []

      // 如果对象的值为数组类型，例：foot: ['a', 'b'] => foot[]=a&foot[]=b
      if (isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach((val: any): void => {
        // 如果值为时间类型，变量后面拼接的是date.toISOString()的结果
        if (isDate(val)) {
          val = val.toISOString()

          // 如果值为对象类型，例：foot: {a: '1234'} => foot={a: '1234'} => encodeURI: foot=%7B%22a%22:%221234%22%7D
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }

        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    // 拼接数组，进行序列化
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const marskIndex: number = url.indexOf('#')

    // 判断url字符串中是否带有哈希值，如果有则去除
    if (marskIndex !== -1) {
      url = url.slice(0, marskIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

/**
 * 判断是否为同源同域请求
 * @param requestURL request的url网络请求地址
 */
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

// 创建一个a链接，通过a的dom方法获取url的域名和协议
const urlParsingNode = document.createElement('a')
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}

// 获取当前网址的url
const currentOrigin = resolveURL(window.location.href)
