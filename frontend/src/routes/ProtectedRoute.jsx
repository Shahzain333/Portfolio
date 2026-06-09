import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom'
import Loader from "../components/Loader";

const ProtectedRoute = ({ children }) => {

    const { isLoggedIn, checkLoading } = useSelector(s => s.auth)

    if(checkLoading) return <Loader fullScreen />

    return isLoggedIn ? children : <Navigate to="/admin/login" replace/>
    
}

export default ProtectedRoute