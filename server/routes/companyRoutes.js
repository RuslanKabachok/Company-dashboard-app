import express from 'express';
import { createCompany, getCompany, deleteCompany, getCompanyById } from '../controllers/companyController.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/', authenticateToken, createCompany);
router.get('/', authenticateToken, getCompany);
router.delete('/:id', authenticateToken, deleteCompany);
router.get('/:id', authenticateToken, getCompanyById);


export default router;
