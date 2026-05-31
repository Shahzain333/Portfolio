import express from 'express'
import { handleAdminLogin, handleAdminLogout, handleIsAuthAdmin } from '../controllers/adminController.js'
import { protect } from '../middlewares/authMiddleware.js'

const authRoutes = express.Router()

authRoutes.post('/admin/logout', protect, handleAdminLogout)
authRoutes.post('/admin/login', handleAdminLogin)
authRoutes.get('/is-admin', protect, handleIsAuthAdmin)

export default authRoutes
