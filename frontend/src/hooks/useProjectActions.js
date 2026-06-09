import { useDispatch } from 'react-redux'
import { getAllProjects, searchProjects, addProject, updateProject, 
    deleteProject, uploadImage } from '../api/projectAPI'
import { setProjects, addProject as addPro, updateProject as updatePro, 
    removeProject, setSearchResults, setLoading, setError } from '../store/slices/projectSlice'
import toast from 'react-hot-toast'

const useProjectActions = () => {

  const dispatch = useDispatch()

  const fetchProjects = async (page = 1, limit = 6) => {
    
    dispatch(setLoading(true))
    
    try {
      const res = await getAllProjects(page, limit)
      dispatch(setProjects(res.data.data))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch projects'))
    }

  }

  const searchProject = async (query) => {   
    try {
      const res = await searchProjects(query)
      dispatch(setSearchResults(res.data.data))
    } catch {
      dispatch(setSearchResults([]))
    }
  }

  const createProject = async (formData, projectData) => {

    dispatch(setLoading(true))
    
    try {
      // upload image first, then create project
      const uploadRes  = await uploadImage(formData)
      const { imageUrl, imageId } = uploadRes.data.data
      const res = await addProject({ ...projectData, imageUrl, imageId })
      dispatch(addPro(res.data.data))
      toast.success('Project added!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add project'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }
  }

  const editProject = async (id, formData, projectData, hasNewImage) => {

    dispatch(setLoading(true))
    
    try {
      let payload = { ...projectData }
      if (hasNewImage) {
        const uploadRes = await uploadImage(formData)
        payload.imageUrl = uploadRes.data.data.imageUrl
        payload.imageId  = uploadRes.data.data.imageId
      }
      const res = await updateProject(id, payload)
      dispatch(updatePro(res.data.data))
      toast.success('Project updated!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update project'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }
  }

  const removeProjects = async (id) => {
    dispatch(setLoading(true))
    try {
      await deleteProject(id)
      dispatch(removeProject(id))
      toast.success('Project deleted!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete project'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }
  }

  return { fetchProjects, searchProject, createProject, editProject, removeProjects }
}

export default useProjectActions