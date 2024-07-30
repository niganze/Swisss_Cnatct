import { Router } from 'express';
import { getProjects, addProject, editProject, deleteProject, setProjectStatus, downloadProjectFile } from '../controllers/projectController.js';
import authMiddleware from '../middleware/auth.js';
import { verifyingtoken } from '../utils/jwtfunctions.js';
import { uploaded } from '../middleware/multer.js';

const router = Router();

router.get('/', verifyingtoken, getProjects);
router.post('/', verifyingtoken, uploaded, addProject);
router.put('/:id', verifyingtoken, uploaded, editProject);
router.delete('/:id', verifyingtoken, deleteProject);
router.patch('/:id/status', verifyingtoken, setProjectStatus);
router.get('/:id/download', verifyingtoken, downloadProjectFile);


export default router;
