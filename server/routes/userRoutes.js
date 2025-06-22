import express from 'express';
import pool from '../config/db.js';
import { getUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.get('/all', authenticateToken, checkRole('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, role FROM users');
        res.json({ users: result.rows });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Помилка при отриманні користувачів' });
    }
});


export default router;
