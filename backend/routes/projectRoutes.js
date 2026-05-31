import express from 'express'
import { addProject } from '../controllers/projectController'
import { storage, fileFilter } from '../middlewares/multerMiddleware'
import multer from 'multer'
import { adminOnly } from '../middlewares/authMiddleware'

const projectRoutes = express.Router()

const upload = multer({ storage, fileFilter })

projectRoutes.post('/add-project', adminOnly, upload.single('imageURL'), addProject)

export default projectRoutes
