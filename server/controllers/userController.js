import pool from '../config/db.js';

export const getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Користувач не знайдений' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Помилка при отриманні профілю:', error);
        res.status(500).json({ message: 'Щось пішло не так' });
    }
};
