import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: 'Користувач створений успішно' });

    } catch (error) {
        console.error('Помилка при реєстрації:', error);
        res.status(500).json({ message: 'Щось пішло не так' });
    }
};
