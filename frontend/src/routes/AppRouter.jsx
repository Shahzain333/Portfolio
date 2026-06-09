import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import store from '../store/store.js'
import { initTheme } from '../store/slices/themeSlice.js'
import useAuthActions from '../hooks/useAuthActions.js'
import ProtectedRoute from './ProtectedRoute.jsx'

import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

// Import Client Side
import HomePage from '../pages/Home.jsx'
import ProjectsPage from '../pages/Project.jsx'
import ExperiencePage from '../pages/Experience.jsx'
import SkillsPage from '../pages/Skills.jsx'

// Import Admin Pages
import LoginPage from '../pages/admin/AdminLogin.jsx'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import DashboardPage from '../pages/admin/Dashboard.jsx'
import AdminProjects from '../pages/admin/AdminProject.jsx'
import AdminExperiences from '../pages/admin/AdminExperience.jsx'
import AdminSkills from '../pages/admin/adminSkill.jsx'

const Init = ({ children }) => {
    
    const dispatch = useDispatch()

    const { checkAuth } = useAuthActions()

    useEffect(() => {
        
        dispatch(initTheme)
        checkAuth() // verify token on every page reload

    }, [])

    return children
}

const PublicLayout = ({ children }) => <><Navbar />{children}<Footer /></>

const AppRouter = () => (
    <Provider store={store}>
        
        <BrowserRouter>
            
            <Init>

                <Routes>
                
                    {/* --------- Public ------------ */}
                    <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                    <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
                    <Route path="/experience" element={<PublicLayout><ExperiencePage /></PublicLayout>} />
                    <Route path="/skills" element={<PublicLayout><SkillsPage /></PublicLayout>} />

                    {/* -------- Admin -------- */}
                    <Route path="/admin/login" element={<LoginPage />} />
                    
                    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="add-projects" element={<AdminProjects />} />
                        <Route path="add-experiences" element={<AdminExperiences />} />
                        <Route path="add-skills" element={<AdminSkills />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>

            </Init>

        </BrowserRouter>
    
    </Provider>
)

export default AppRouter