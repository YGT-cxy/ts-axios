import { AxiosTransformer } from './../types'

/**
 * 遍历相应的处理转换函数
 * @param data config的data或响应的data数据
 * @param headers reqeust请求的headers
 * @param fns 相应的处理转换函数
 */
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
