import axios from 'axios'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '')
const apiBaseUrl = backendUrl?.endsWith('/api/v1')
    ? backendUrl
    : backendUrl
        ? `${backendUrl}/api/v1`
        : '/api/v1'

let authTokenProvider = null

export function setAuthTokenProvider(provider) {
    authTokenProvider = provider

    return () => {
        if (authTokenProvider === provider) {
            authTokenProvider = null
        }
    }
}

async function getAuthToken() {
    if (authTokenProvider) {
        return authTokenProvider()
    }

    if (typeof window === 'undefined') {
        return null
    }

    return window.Clerk?.session?.getToken?.() ?? null
}

function setAuthorizationHeader(headers, token) {
    if (typeof headers.set === 'function') {
        headers.set('Authorization', `Bearer ${token}`)
        return
    }

    headers.Authorization = `Bearer ${token}`
}

const api = axios.create({

    baseURL: apiBaseUrl,

    headers: {
        'Content-Type': 'application/json',
    },

})

api.interceptors.request.use(async (config) => {
    const token = await getAuthToken()

    if (!token) {
        return config
    }

    config.headers = config.headers ?? {}
    setAuthorizationHeader(config.headers, token)

    return config
})


export default api
