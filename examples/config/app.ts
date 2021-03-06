import axios, { AxiosTransformer }  from '../../src/index'
import qs from 'qs'

// axios.defaults.headers.common['test2'] = 123

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
//   headers: {
//     test: '321'
//   }
// }).then((res) => {
//   console.log(res.data)
// }).catch(err => {
//   console.log(err)
// })

// axios({
//   transformRequest: [(function(data, headers) {
//     console.log(headers)
//     // console.log(data)
//     return qs.stringify(data)
//   }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
//   transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
//     if (typeof data === 'object') {
//       data.b = 2
//     }
//     return data
//   }],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then((res) => {
//   console.log('response数据：')
//   console.log(res.data)
// }).catch(err => {
//   console.log(err)
// })

// const instance = axios.create({
//   transformRequest: [(function(data) {
//     return qs.stringify(data)
//   }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
//   transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
//     if (typeof data === 'object') {
//       data.b = 2
//     }
//     return data
//   }]
// })

// instance({
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then((res) => {
//   console.log(res.data)
// }).catch(err => {
//   console.log(err)
// })


// const a = new axios({
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 2
//   }
// })
// a.then(res => {
//   console.log(res.data)
// })


const instance = axios.create({
  headers: {
    common: {
      'X-COMMON-HEADER': 'commonHeaderValue'
    },
    get: {
      'X-GET-HEADER': 'getHeaderValue'
    },
    post: {
      'X-POST-HEADER': 'postHeaderValue'
    }
  }
})

instance.get('/foo', {
  headers: {
    'X-FOO-HEADER': 'fooHeaderValue',
    'X-BAR-HEADER': 'barHeaderValue'
  }
})
