import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types/index'
import XHR from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'

export default function axois(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)

  return XHR(config).then((res: AxiosResponse): AxiosResponse => {
    return transformResponseData(res)
  })
}

/**
 * 处理config参数
 * @param config request请求的config参数
 */
function processConfig(config: AxiosRequestConfig): void {
  config.headers = transformHeader(config)
  config.url = transformURL(config)
  config.data = transformRequestData(config)
}

/**
 * 处理config参数中的url和params参数对象，将两者拼接在一起，返回一个拼接后的字符串
 * @param config reqeust请求的config参数
 */
function transformURL(config: AxiosRequestConfig): string {
  const {url, params} = config
  return buildURL(url, params)
}

/**
 * 处理config参数中的data数据，如果为普通数据则使用JSON.stringify进行转义
 * @param config request请求的config参数
 */
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

/**
 * 根据config参数中的data数据，处理header中携带的东西
 * @param config request请求的config参数
 */
function transformHeader(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}
