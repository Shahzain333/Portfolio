import api from './axiosInstance'

export const loginAdmin  = data => api.post('/auth/admin/login', data)
export const logoutAdmin = ()   => api.post('/auth/admin/logout')
export const isAdmin     = ()   => api.get('/auth/is-admin')