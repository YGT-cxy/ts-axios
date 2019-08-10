import { AxiosInstance, AxiosRequestConfig } from './types'
import { extend } from './helpers/utils'
import Axios from './core/Axios'
import defaults from './defaults'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  // 拷贝Axios实例上的方法到instance中
  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
