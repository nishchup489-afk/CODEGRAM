import axios from 'axios'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '')
const apiBaseUrl = backendUrl?.endsWith('/api/v1')
    ? backendUrl
    : backendUrl
        ? `${backendUrl}/api/v1`
        : '/api/v1'

const api = axios.create({

    baseURL: apiBaseUrl,

    headers: {
        'Content-Type': 'application/json',
    },

})


export default api
