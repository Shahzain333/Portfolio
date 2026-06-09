import { useDispatch } from 'react-redux'
import { getAllExperiences, addExperience, updateExperience, deleteExperience } from '../api/experienceAPI'
import { setExperiences, addExperience as addExp, updateExperience as updateExp, 
    removeExperience, setLoading, setError } from '../store/slices/experienceSlice'
import toast from 'react-hot-toast'

const useExperienceActions = () => {

  const dispatch = useDispatch()

  const fetchExperiences = async (page = 1, limit = 10) => {
    
    dispatch(setLoading(true))
    
    try {
      const res = await getAllExperiences(page, limit)
      dispatch(setExperiences(res.data.data))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch experiences'))
    }
  }

  const createExperience = async (data) => {

    dispatch(setLoading(true))
    
    try {
      const res = await addExperience(data)
      dispatch(addExp(res.data.data))
      toast.success('Experience added!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add experience'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }

  }

  const editExperience = async (id, data) => {

    dispatch(setLoading(true))
    
    try {
      const res = await updateExperience(id, data)
      dispatch(updateExp(res.data.data))
      toast.success('Experience updated!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update experience'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }
  
}

  const removeExperiences = async (id) => {

    dispatch(setLoading(true))
    
    try {
      await deleteExperience(id)
      dispatch(removeExperience(id))
      toast.success('Experience deleted!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete experience'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }

  }

  return { fetchExperiences, createExperience, editExperience, removeExperiences }
}

export default useExperienceActions