import express from 'express';
import pool from '../config/db.js';
import { createCompany, deleteCompany, getCompanyById, updateCompany, filterAndSortCompanies, getUserCompanies } from '../controllers/companyController.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';
import upload from '../middleware/uploadMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('logo'), createCompany);
router.get('/filter', authenticateToken, filterAndSortCompanies);
router.delete('/:id', authenticateToken, deleteCompany);
router.get('/:id', authenticateToken, getCompanyById);
router.put('/:id', authenticateToken, upload.single('logo'), updateCompany);
router.get('/', authenticateToken, getUserCompanies);
router.get('/all', authenticateToken, checkRole('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies');
        res.json({ companies: result.rows });
    } catch (error) {
        console.error('Помилка при отриманні компаній (admin):', error);
        res.status(500).json({ message: 'Помилка при отриманні компаній' });
    }
});

export default router;
