import express from 'express'
import { handleAdminLogin, handleIsAuthAdmin } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const authRoutes = express.Router()

authRoutes.post('/logout', protect, handleUserLogout)
authRoutes.post('/admin/login', handleAdminLogin)
authRoutes.get('/is-admin', protect, handleIsAuthAdmin)

export default authRoutes
