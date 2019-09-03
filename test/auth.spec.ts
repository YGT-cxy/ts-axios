import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('auth', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('应该接受带有用户名/密码的HTTP基本身份验证', () => {
    axios('/foo', {
      auth: {
        username: 'Aladdin',
        password: 'open sesame'
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Authorization']).toBe('Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==')
    })
  })

  test('是否应该用非拉丁字符编码HTTP基本auth凭据', () => {
    return axios('/foo', {
      auth: {
        username: 'Aladßç£☃din',
        password: 'open sesame'
      }
    })
      .then(() => {
        throw new Error('不应该成功地使用凭证中的非拉丁字符发出HTTP基本身份验证请求')
      })
      .catch(error => {
        expect(/character/i.test(error.message)).toBeTruthy()
      })
  })
})
