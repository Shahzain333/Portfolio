import { useDispatch } from 'react-redux'
import { getAllProjects, searchProjects, addProject, updateProject, deleteProject } from '../api/projectAPI.js'
import { setProjects, addProject as addPro, updateProject as updatePro,
    removeProject, setSearchResults, setLoading, setError } from '../store/slices/projectSlice.js'
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
      // backend returns array directly for search
      dispatch(setSearchResults(Array.isArray(res.data.data) ? res.data.data : []))
    } catch {
      dispatch(setSearchResults([]))
    }
  }

  // FIX: send everything as FormData in one request
  // Backend: POST /projects/add-project with multer upload.single('imageURL')
  // FormData fields: title, description, category, projectUrl, sourceCodeUrl, status, imageURL (file)
  const createProject = async (projectData, imageFile) => {
    dispatch(setLoading(true))
    try {
      const fd = new FormData()
      Object.entries(projectData).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('imageURL', imageFile)
      const res = await addProject(fd)
      dispatch(addPro(res.data.data))
      dispatch(setLoading(false))
      toast.success('Project added!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add project'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }
  }

  // FIX: same — FormData with optional image
  const editProject = async (id, projectData, imageFile) => {
    dispatch(setLoading(true))
    try {
      const fd = new FormData()
      Object.entries(projectData).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('imageURL', imageFile)
      const res = await updateProject(id, fd)
      dispatch(updatePro(res.data.data))
      dispatch(setLoading(false))
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
      dispatch(setLoading(false))
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
