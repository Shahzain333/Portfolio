import { useDispatch } from 'react-redux'
import { getAllSkills, addSkill, updateSkill, deleteSkill } from '../api/skillAPI'
import { setSkills, addSkill as addSki, updateSkill as updateSki, 
    removeSkill, setLoading, setError } from '../store/slices/skillSlice'
import toast from 'react-hot-toast'

const useSkillActions = () => {

  const dispatch = useDispatch()

  const fetchSkills = async (page = 1, limit = 50) => {
    dispatch(setLoading(true))
    try {
      const res = await getAllSkills(page, limit)
      dispatch(setSkills(res.data.data))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch skills'))
    }
  }

  const createSkill = async (data) => {
    dispatch(setLoading(true))
    try {
      const res = await addSkill(data)
      dispatch(addSki(res.data.data))
      toast.success('Skill added!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add skill'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }
  }

  const editSkill = async (id, data) => {
    dispatch(setLoading(true))
    try {
      const res = await updateSkill(id, data)
      dispatch(updateSki(res.data.data))
      toast.success('Skill updated!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update skill'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }
  }

  const removeSkills = async (id) => {
    dispatch(setLoading(true))
    try {
      await deleteSkill(id)
      dispatch(removeSkill(id))
      toast.success('Skill deleted!')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete skill'
      dispatch(setError(msg))
      toast.error(msg)
      return false
    }
  }

  return { fetchSkills, createSkill, editSkill, removeSkills }
}

export default useSkillActions