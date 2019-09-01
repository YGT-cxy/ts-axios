import Cancel, { isCancel } from './../../src/cancel/Cancel'

describe('cancel: Cancel', () => {
  test('测试实例化Cancel后，取消的原因', () => {
    const cancel = new Cancel('operation has been canceled.')
    expect(cancel.message).toBe('operation has been canceled.')
  })

  test('测试实例后的Cancel应该属于Cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  test('值不是Cancel，应该返回false', () => {
    expect(isCancel({ foo: 'this is foo' })).toBeFalsy()
  })
})
