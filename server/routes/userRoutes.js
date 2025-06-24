import express from 'express';
import pool from '../config/db.js';
import { getUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);

router.get('/all', authenticateToken, checkRole('admin', 'superadmin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role FROM users');
        res.json({ users: result.rows });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Помилка при отриманні користувачів' });
    }
});

router.get('/companies', authenticateToken, checkRole('admin', 'superadmin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies');
        res.json({ companies: result.rows });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Помилка при отриманні компаній' });
    }
});

router.put(
    '/role/:id',
    authenticateToken,
    checkRole('superadmin'),
    async (req, res) => {
        const userId = req.params.id;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Недійсна роль' });
        }

        try {
            const result = await pool.query(
                'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
                [role, userId]
            );
            res.status(200).json({ message: 'Роль оновлено', user: result.rows[0] });
        } catch (error) {
            console.error('❌ Помилка при оновленні ролі:', error);
            res.status(500).json({ message: 'Щось пішло не так' });
        }
    }
);


router.delete('/:id', authenticateToken, checkRole('superadmin'), async (req, res) => {
    const userId = req.params.id;

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.status(200).json({ message: 'Користувача видалено' });
    } catch (error) {
        console.error('❌ Помилка при видаленні користувача:', error);
        res.status(500).json({ message: 'Щось пішло не так' });
    }
});

export default router;
