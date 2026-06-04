import express from 'express'
import { handleAdminLogin, handleAdminLogout, handleIsAuthAdmin, handleRefreshToken } from '../controllers/adminController.js'
import { adminOnly } from '../middlewares/authMiddlewares.js'

const authRoutes = express.Router()

authRoutes.post('/admin/login', handleAdminLogin)
authRoutes.post('/admin/logout', adminOnly, handleAdminLogout)
authRoutes.get('/is-admin', adminOnly, handleIsAuthAdmin)
//authRoutes.post('/admin/refresh',adminOnly, handleRefreshToken)

export default authRoutes
