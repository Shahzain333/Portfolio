import express from 'express'
import { addProject } from '../controllers/projectController'
import { adminOnly } from '../middlewares/authMiddlewares.js'

const projectRoutes = express.Router()

projectRoutes.post('/add', adminOnly, addProject)

export default projectRoutes
