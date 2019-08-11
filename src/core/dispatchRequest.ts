import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './../types/index'
import XHR from './xhr'
import { buildURL } from './../helpers/url'
import { transformResponse } from './../helpers/data'
import { flattenHeaders } from './../helpers/headers'
import transform from './transform'

// axios中的核心方法，返回一个XMLHttpRequest请求的Promise方法
export default function dispatchReqeust(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)

  return XHR(config).then(
    (res: AxiosResponse): AxiosResponse => {
      return transformResponseData(res)
    }
  )
}

/**
 * 处理config参数
 * @param config request请求的config参数
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 * 处理config参数中的url和params参数对象，将两者拼接在一起，返回一个拼接后的字符串
 * @param config reqeust请求的config参数
 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

/**
 * 处理响应返回的数据，尝试转为JSON对象
 * @param res 响应返回的数据
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}
