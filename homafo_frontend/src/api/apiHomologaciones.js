import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
})
const unidades = {
    get: params => axios.get('/api/v2/comments', { params }),
    delete: params => axios.delete('/api/v2/comments', { params }),
    novedadesVisita: params => API.get('/uniUnidad/dto/novedadesVisitas',{params})
    // etc.
  }
  
  const posts = {
    get: params => axios.get('/api/v2/posts', { params }),
    // etc.
  }

  export default {
    unidades,
    posts
  }