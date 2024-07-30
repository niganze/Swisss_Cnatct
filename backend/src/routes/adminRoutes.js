// routes/adminRoutes.js
import { Router } from 'express';
import { getDashboard, manageSchools, manageProjects, updateSettings, logout } from '../controllers/adminController';
import auth from '../middleware/auth';

const router = Router();

router.get('/dashboard', auth, getDashboard);
router.post('/schools', auth, manageSchools);
router.post('/projects', auth, manageProjects);
router.put('/settings', auth, updateSettings);
router.post('/logout', auth, logout);


export default router;
