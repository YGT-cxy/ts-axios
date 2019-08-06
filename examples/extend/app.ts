import axios from './../../src/index'

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'post hi'
  }
})

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'post hi'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'request post hi'
  }
})

axios.post('/extend/post', {
  msg: 'axios post hi'
})
axios.get('/extend/get')
axios.put('/extend/put', {
  msg: 'put'
})
axios.delete('/extend/delete')
axios.head('/extend/head')
axios.options('/extend/options')
