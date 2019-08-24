import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './../types/index'
import XHR from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from './../helpers/url'
import { flattenHeaders } from './../helpers/headers'
import transform from './transform'

// axios中的核心方法，返回一个XMLHttpRequest请求的Promise方法
export default function dispatchReqeust(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRquested(config)
  processConfig(config)

  return XHR(config)
    .then(
      (res: AxiosResponse): AxiosResponse => {
        return transformResponseData(res)
      }
    )
    .catch(e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      return Promise.reject(e)
    })
}

/**
 * 处理config参数
 * @param config request请求的config参数
 */
function processConfig(config: AxiosRequestConfig): void {
  // 处理url
  config.url = transformURL(config)
  // 执行所有的transformRequest函数
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 扁平化处理headers
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 * 处理config参数中的url和params参数对象，将两者拼接在一起，返回一个拼接后的字符串
 * @param config reqeust请求的config参数
 */
export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  // 当绝对地址存在，且url不是绝对地址，拼接两个字符串地址为一个字符串地址
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }

  return buildURL(url!, params, paramsSerializer)
}

/**
 * 处理响应返回的数据，尝试转为JSON对象
 * @param res 响应返回的数据
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

/**
 * 判断config里的cancelToken是否已经被使用过，使用过则无法发起request请求
 * @param config request的config配置
 */
function throwIfCancellationRquested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
