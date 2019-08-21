import {
  isDate,
  isArray,
  isFormData,
  isObject,
  isPlainObject,
  isURLSearchParams,
  extend,
  deepMerge
} from './../../src/helpers/utils'
describe('helpers:util', () => {
  describe('isXX', () => {
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })

    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })

    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy()
    })

    test('should validate Array', () => {
      expect(isArray([])).toBeTruthy()
      expect(isArray(1234)).toBeFalsy()
    })

    test('should validate Object', () => {
      expect(isObject({})).toBeTruthy()
      expect(isObject([])).toBeTruthy()
      expect(isObject(new Date())).toBeTruthy()
      expect(isObject(1234)).toBeFalsy()
    })

    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject([])).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }

      extend(a, b)

      expect(a.foo).toBe(123)
    })

    test('should extend properties', function() {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)

      expect(a.bar).toBe(789)
      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    // 测试拷贝时，会不会影响原来的对象
    test('should be immutable', () => {
      const a = Object.create(null)
      const b: any = {
        foo: 1234
      }
      const c: any = {
        bar: 4321
      }

      deepMerge(a, b, c)

      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })

    // 测试对象拷贝后，后者相同的key会覆盖前者的相同key的值，同时返回全新的对象
    test('should deepMerge properties', () => {
      const a = { foo: 1234 }
      const b = { bar: 4321 }
      const c = { foo: 1234567 }

      const d = deepMerge(a, b, c)

      expect(d.foo).toBe(1234567)
      expect(d.bar).toBe(4321)
    })

    // 测试深度拷贝
    test('should deepMerge recursively', function() {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456
        },
        bar: {
          qux: 789
        }
      })
    })

    // 测试拷贝的值与原来的对象是不是没有关系
    test('should remove all references from nested objects', () => {
      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123
        }
      })

      expect(c.foo).not.toBe(a.foo)
    })

    // 测试与undefined和null的情况
    test('should handle null and undefined arguments', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, undefined)).toEqual({ foo: 123 })

      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 })
    })
  })
})
