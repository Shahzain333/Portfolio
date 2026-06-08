import axios from 'axios';
import toast  from 'react-hot-toast';

const api = axios.create({ baseURL: '/api/v1', withCredentials: true });

let isRefreshing = false;
let queue = [];

const flush = (err) => {
  queue.forEach(p =>
    err ? p.reject(err) : p.resolve()
  )
  queue = []
}

api.interceptors.response.use(
    
    r => r,
    async err => {
        
        const orig = err.config;

        if(err.response?.status !== 401 || orig._retry) return Promise.reject(err);

        if(orig.url.includes('/auth/admin/refresh') || orig.url.includes('/auth/admin/login')) {
            window.location.href = '/admin/login';
            return Promise.reject(err);
        }

        if(isRefreshing) return new Promise((res, rej) => 
            queue.push({ 
                resolve: res, 
                reject: rej 
            })
        ).then(() => api(orig));

        orig._retry = true;
        isRefreshing = true;

        try {
            await api.post('/auth/admin/refresh');
            flush(null);
            return api(orig);
        } catch (e) {
            flush(e);
            toast.error('Session expired. Please login again.');
            window.location.href = '/admin/login';
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }

    }
)

export default api;