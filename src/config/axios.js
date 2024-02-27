import axios from 'axios'
import config from './config'

export default axios.create({ baseURL: config.baseUrl })

export const axiosPrivate = axios.create({
    baseURL: config.baseUrl,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    withCredentials: true,
}
)
