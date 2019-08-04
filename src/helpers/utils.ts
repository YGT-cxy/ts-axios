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