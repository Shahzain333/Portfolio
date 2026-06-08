import api from './axiosInstance'

export const addExperience = data => api.post('/experiences/add-experience', data)
export const updateExperience = (id,data) => api.put(`/experiences/update-experience/${id}`, data)
export const deleteExperience = id => api.delete(`/experiences/delete-experience/${id}`)
export const getAllExperiences = (page=1,limit=10) => api.get(`/experiences/all-experiences?page=${page}&limit=${limit}`)