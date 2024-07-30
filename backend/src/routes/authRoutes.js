// routes/authRoutes.js
import { Router } from 'express';
import { adminLogin, schoolLogin, register } from '../controllers/authController.js';
import { verifyingtoken } from '../utils/jwtfunctions.js';


const router = Router();

router.post('/admin/login', adminLogin);
router.post('/school/login', schoolLogin);
router.post('/register', register); 
router.post('/addSchool', addSchool);
router.post('/change-username/:id',verifyingtoken, changeUsername);
export default router;

