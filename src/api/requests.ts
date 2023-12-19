import axios from 'axios'

const API = axios.create({
  baseURL:'http://localhost:3066/api',
  timeout: 20000
})

export default API
