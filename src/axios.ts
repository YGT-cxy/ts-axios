import { AxiosRequestConfig, AxiosStatic } from './types'
import { extend } from './helpers/utils'
import Axios from './core/Axios'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  /**
   * 实例一个Axios类
   */
  const context = new Axios(config)

  /**
   * 绑定this指向为Axios实例的requst方法
   */
  const instance = Axios.prototype.request.bind(context)

  // 拷贝Axios实例上的方法到instance中
  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
