import { useDispatch } from 'react-redux'
import { loginAdmin, logoutAdmin, isAdmin } from '../api/authAPI'
import { adminLogin, adminLogout, setAuthChecked, 
    setLoading, setError } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const useAuthActions = () => {
    
    const dispatch = useDispatch()

    const login = async (credentials) => {

        dispatch(setLoading(true))
        
        try {
            const res = await loginAdmin(credentials)
            dispatch(adminLogin(res.data.data))
            toast.success('Welcome back!')
            return true
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed'
            dispatch(setError(msg))
            toast.error(msg)
            return false
        }
    
    }

    const logout = async () => {
        try {
            await logoutAdmin()
            dispatch(adminLogout())
            toast.success('Logged out!')
        } catch {
            dispatch(adminLogout()) // clear state even if API fails
        }
    }

    const checkAuth = async () => {
        try {
            const res = await isAdmin()
            dispatch(setAuthChecked({ 
                isLoggedIn: true, 
                admin: res.data.data 
            }))
        } catch {  
            dispatch(setAuthChecked({ 
                isLoggedIn: false, 
                admin: null 
            }))
        }
    }

    return { login, logout, checkAuth }

}

export default useAuthActions