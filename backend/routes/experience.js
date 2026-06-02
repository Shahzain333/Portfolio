import express from 'express';
import { addExperience, updateExperience, deleteExperience, getAllExperiences } from '../controllers/experienceController.js';
import { adminOnly } from '../middlewares/authMiddlewares.js';

const experienceRoutes = express.Router();

// public
experienceRoutes.get('/all-experiences', getAllExperiences);

// admin only
experienceRoutes.post('/add-experience', adminOnly, addExperience);
experienceRoutes.put('/update-experience/:id', adminOnly, updateExperience);
experienceRoutes.delete('/delete-experience/:id', adminOnly, deleteExperience);

export default experienceRoutes;