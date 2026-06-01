import express from 'express'
import { addProject, updateProject, deleteProject, getAllProjects } from '../controllers/projectController.js'
import { storage, fileFilter } from '../middlewares/multerMiddlewares.js'
import multer from 'multer'
import { adminOnly } from '../middlewares/authMiddlewares.js'

const projectRoutes = express.Router()

const upload = multer({ storage, fileFilter })

projectRoutes.post('/add-project', adminOnly, upload.single('imageURL'), addProject)
projectRoutes.put('/update-project/:id', adminOnly, upload.single('imageURL'), updateProject)
projectRoutes.get('/all-projects', getAllProjects)
projectRoutes.delete('/delete-project/:id', adminOnly, deleteProject)

export default projectRoutes
