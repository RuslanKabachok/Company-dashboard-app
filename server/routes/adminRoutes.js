import express from 'express';
import { authenticateToken } from '../middleware/authMiddleWare.js';
import { checkRole } from '../middleware/roleMiddleware.js';
import { getAllCompanies } from '../controllers/adminController.js';

const router = express.Router();

router.get('/companies', authenticateToken, checkRole, getAllCompanies);

export default router;
