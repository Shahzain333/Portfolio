import express from 'express';
import { addSkill, updateSkill, deleteSkill, getAllSkills, getSkillsByCategory } from '../controllers/skillController.js';
import { adminOnly } from '../middlewares/authMiddlewares.js';

const skillRoutes = express.Router();

// public
skillRoutes.get('/all-skills', getAllSkills);
skillRoutes.get('/category/:category', getSkillsByCategory);

// admin only
skillRoutes.post('/add-skill', adminOnly, addSkill);
skillRoutes.put('/update-skill/:id', adminOnly, updateSkill);
skillRoutes.delete('/delete-skill/:id', adminOnly, deleteSkill);

export default skillRoutes;