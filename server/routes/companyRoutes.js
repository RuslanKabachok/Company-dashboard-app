import express from 'express';
import { createCompany, getCompany, deleteCompany, getCompanyById, updateComapany, getUserCompanies, filterAndSortCompanies, updateCompanyLogo } from '../controllers/companyController.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createCompany);
router.get('/', authenticateToken, getCompany);
router.get('/filter', authenticateToken, filterAndSortCompanies);
router.delete('/:id', authenticateToken, deleteCompany);
router.get('/:id', authenticateToken, getCompanyById);
router.put('/:id', authenticateToken, updateComapany);
router.get('/', authenticateToken, getUserCompanies);
router.put(
    '/:id/logo',
    authenticateToken,
    upload.single('logo'),
    updateCompanyLogo
);


export default router;
