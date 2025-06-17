import express from 'express';
import { createCompany, getCompany, deleteCompany, getCompanyById, updateCompany, getUserCompanies, filterAndSortCompanies } from '../controllers/companyController.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('logo'), createCompany);
router.get('/', authenticateToken, getCompany);
router.get('/filter', authenticateToken, filterAndSortCompanies);
router.delete('/:id', authenticateToken, deleteCompany);
router.get('/:id', authenticateToken, getCompanyById);
router.put('/:id', authenticateToken, upload.single('logo'), updateCompany);
router.get('/', authenticateToken, getUserCompanies);


export default router;
