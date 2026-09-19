import axios from 'axios'
import toast  from 'react-hot-toast'

const api = axios.create({
    baseURL:         '/api/v1',    // uses Vite proxy → http://localhost:8000/api/v1
    withCredentials: true,         // send cookies on every request
})

let isRefreshing = false
let queue        = []

const flushQueue = (err) => {
    queue.forEach(p => err ? p.reject(err) : p.resolve())
    queue = []
}

api.interceptors.response.use(
    res => res,
    async err => {

        const orig = err.config

        // Not a 401 — pass through unchanged
        if (err.response?.status !== 401) return Promise.reject(err)

        // Already retried this request — don't loop
        if (orig._retry) return Promise.reject(err)

        // FIX: checkAuth() hitting /is-admin with no session is a NORMAL 401
        // Don't refresh/redirect for it — just let it fail silently
        // The catch in useAuthActions.checkAuth() handles it cleanly
        if (orig.url?.includes('/auth/is-admin')) return Promise.reject(err)

        // Login failed — wrong credentials, don't try to refresh
        if (orig.url?.includes('/auth/admin/login')) return Promise.reject(err)

        // Refresh itself failed — session is truly expired
        // Only show toast + redirect when actually ON an admin page
        if (orig.url?.includes('/auth/admin/refresh')) {
            const onAdminPage = window.location.pathname.startsWith('/admin')
            if (onAdminPage) {
                toast.error('Session expired. Please login again.')
                window.location.href = '/admin/login'
            }
            return Promise.reject(err)
        }

        // For all other 401s (protected API calls from admin pages) — try to refresh
        if (isRefreshing) {
            return new Promise((resolve, reject) => queue.push({ resolve, reject }))
                .then(() => api(orig))
        }

        orig._retry   = true
        isRefreshing  = true

        try {
            await api.post('/auth/admin/refresh')
            flushQueue(null)
            return api(orig)
        } catch (e) {
            flushQueue(e)
            const onAdminPage = window.location.pathname.startsWith('/admin')
            if (onAdminPage) {
                toast.error('Session expired. Please login again.')
                window.location.href = '/admin/login'
            }
            return Promise.reject(e)
        } finally {
            isRefreshing = false
        }
    }
)

export default api
