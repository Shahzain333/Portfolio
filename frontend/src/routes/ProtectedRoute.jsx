import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Loader from '../components/Loader'

const ProtectedRoute = ({ children }) => {

    const { isLoggedIn, checkLoading } = useSelector(s => s.auth ?? {})

    // Still verifying session on page reload — show loader, don't redirect yet
    // Without this, Redux initialState has isLoggedIn=false and would
    // immediately redirect to /login before checkAuth() even responds
    if (checkLoading) return <Loader fullScreen />

    // checkAuth() has resolved — now we know the real auth state
    return isLoggedIn ? children : <Navigate to="/admin/login" replace />

}

export default ProtectedRoute
