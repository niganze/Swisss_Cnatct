// routes/schoolRoutes.js
import { Router } from 'express';
import { addSchool, editSchool, deleteSchool, revokeGrantSchool, getSchools, getSchoolById } from '../controllers/schoolController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, addSchool);
router.put('/:id', auth, editSchool);
router.delete('/:id', auth, deleteSchool);
router.patch('/:id/revoke-grant', auth, revokeGrantSchool);
router.get('/', auth, getSchools);
router.get('/:id', auth, getSchoolById);

export default router;
