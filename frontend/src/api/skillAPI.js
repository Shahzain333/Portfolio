import api from './axiosInstance'

export const addSkill = data => api.post('/skills/add-skill', data)
export const updateSkill = (id,data) => api.put(`/skills/update-skill/${id}`, data)
export const deleteSkill = id => api.delete(`/skills/delete-skill/${id}`)

export const getSkillsByCategory = cat => api.get(`/skills/category/${cat}`)
export const getAllSkills = (page=1,limit=50) => api.get(`/skills/all-skills?page=${page}&limit=${limit}`)