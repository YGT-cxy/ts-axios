const toString = Object.prototype.toString

/**
 * 返回一个布尔值判断当前传入的变量是否为数组类型对象
 * @param val 需要判断是否为数组类型的变量
 */
export const isArray = (val: any): Boolean => {
  return toString.call(val) === '[object Array]'
}

/**
 * 返回一个布尔值判断当前传入的变量是否为时间类型对象
 * @param val 需要判断是否为时间对象的变量
 */
export const isDate = (val: any): val is Date => {
  return toString.call(val) === '[object Date]'
}

/**
 * 返回一个布尔值判断当前传入的变量是否为对象
 * @param val 需要判断是否为对象的变量
 */
export const isObject = (val: any): val is Object => {
  return val !== null && typeof val === 'object'
}

/**
 * 返回一个布尔值判断当前传入的变量是否为普通类型对象
 * @param val 需要判断是否为普通对象的变量
 */
export const isPlainObject = (val: any): val is Object => {
  return toString.call(val) === '[object Object]'
}

/**
 * 返回一个布尔值判断当前传入的变量是否为FormData类型对象
 * @param val 需要判断是否为FormData对象的变量
 */
export const isFormData = (val: any): val is FormData => {
  return typeof val !== 'undefined' && val instanceof FormData
}

/**
 * 返回一个布尔值判断当前传入的变量是否为URLSearchParams类型对象
 * @param val 需要判断是否为URLSearchParams对象的变量
 */
export const isURLSearchParams = (val: any): val is URLSearchParams => {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

/**
 * 将被拷贝的对象里的属性和方法拷贝到目标对象中
 * @param to 拷贝的目标对象
 * @param from 被拷贝的目标对象
 */
export const extend = <T, U>(to: T, from: U): T & U => {
  for (let prototype in from) {
    ;(to as T & U)[prototype] = from[prototype] as any
  }
  return to as T & U
}

/**
 * 深度拷贝对象
 * @param objs 接受需要拷贝的对象，有相同key时后者覆盖前者，使用...接受不定个数的拷贝对象
 */
export const deepMerge = (...objs: any[]): any => {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]

        if (isPlainObject(val)) {
          // 判断是解决result[key]为undefined时，减少一次遍历 -- 优化代码
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
