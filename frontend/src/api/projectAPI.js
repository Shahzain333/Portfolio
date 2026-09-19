import api from './axiosInstance'

// Let the browser set the multipart boundary for FormData requests.
export const addProject    = data  => api.post('/projects/add-project',         data)
export const updateProject = (id,data) => api.put(`/projects/update-project/${id}`, data)
export const deleteProject = id   => api.delete(`/projects/delete-project/${id}`)
export const searchProjects= q    => api.get(`/projects/search-project/${encodeURIComponent(q)}`)
export const getAllProjects = (page=1,limit=6) => api.get(`/projects/all-projects?page=${page}&limit=${limit}`)
