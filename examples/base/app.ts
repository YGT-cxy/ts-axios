import axios from './../../src/index'

/*
// params数据处理

// 测试数组类型params
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: ['bar', 'baz']
  }
})

// 测试对象类型的params
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: {
      bar: 'this is baz'
    }
  }
})

// 测试时间类型的params
const date = new Date()
axios({
  method: 'get',
  url: '/base/get',
  params: {
    date
  }
})

// 测试不需要处理的特殊字符类型的params
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: '@:$, '
  }
})

// 测试null和undefined类型的params
axios({
  method: 'get',
  url: '/base/get',
  params: {
    foo: 'bar',
    baz: null
  }
})

// 测试url中带有哈希值的
axios({
  method: 'get',
  url: '/base/get#hash',
  params: {
    foo: 'bar'
  }
})

// 测试已带有参数值的拼接
axios({
  method: 'get',
  url: '/base/get?foo=bar',
  params: {
    bar: 'baz'
  }
})

// 综合测试
axios({
  method: 'get',
  url: '/base/get#hash?head=666',
  params: {
    a: 123,
    b: {
      header: '我是a',
      body: '我带有空格 空格',
      foot: [1, 2, 3, 4]
    },
    c: null,
    d: undefined,
    e: [123, 33, 44],
    f: [{a: null}, {b: undefined}, {c: 1}]
  }
})

*/

// data数据的处理
// axios({
//   method: 'post',
//   url: '/base/post',
//   data: {
//     a: 1,
//     b: 2
//   }
// })

// const arr = new Int32Array([21, 31])

// axios({
//   method: 'post',
//   url: '/base/buffer',
//   data: arr
// })

// const formData = new FormData()
// formData.append('username', '小明')

// axios({
//   method: 'post',
//   url: '/base/formData',
//   data: formData
// })

// axios({
//   method: 'post',
//   url: '/base/post',
//   headers: {
//     'content-type': 'application/json;'
//   },
//   data: {
//     a: 1,
//     b: 2
//   }
// })

// const paramsString = 'q=URLUtils.searchParams&topic=api'
// const searchParams = new URLSearchParams(paramsString)

// axios({
//   method: 'post',
//   url: '/base/post',
//   data: searchParams
// })

// 测试响应数据
axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  }
}).then((res) => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

axios({
  method: 'post',
  url: '/base/post',
  responseType: 'json',
  data: {
    a: 3,
    b: 4
  }
}).then((res) => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
