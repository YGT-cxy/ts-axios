import { AxiosRequestConfig } from './../types'
import { isPlainObject, deepMerge } from '../helpers/utils'

/**
 * config配置项中key中对应的处理方法
 */
const strats = Object.create(null)

/**
 * 默认的合并配置的方法
 * @param val1 默认配置项的val值
 * @param val2 自定义配置项的val值
 */
function defaultStart(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

/**
 * 针对特殊的配置项处理合并方法
 * @param val1 默认配置项的val值
 * @param val2 自定义配置项的val值
 */
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

/**
 * 针对类似header复合类型对象配置项的合并方法
 * @param val1
 * @param val2
 */
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

/**
 * config需要特殊处理的key配置项
 */
const stratKeysFromVal2 = ['url', 'params', 'data']

/**
 * 分配方法
 */
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

/**
 * 需要deepMergeStrat合并的复合类型对象
 */
const stratKeysDeepMerge = ['headers']

/**
 * 分配方法
 */
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

/**
 * 合并config的配置项
 * @param config1 默认的config
 * @param config2 自定义的config
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  const config = Object.create(null)

  if (!config2) {
    config2 = {}
  }

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    // 排除重复定义同一个配置项，导致默认配置项覆盖自定义配置项
    if (!config[key]) {
      mergeField(key)
    }
  }

  /**
   * 分配配置项的处理方法，并执行方法，进行配置合并
   * @param key config的key配置项
   */
  function mergeField(key: string): void {
    // 分配方法
    const strat = strats[key] || defaultStart
    // 执行分配的合并配置的方法，合并配置
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
