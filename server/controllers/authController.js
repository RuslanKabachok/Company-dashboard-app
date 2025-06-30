import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const signup = async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        if (role === 'admin') {
            return res.status(403).json({ message: 'Створення адміністратора заборонене' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
            [name, email, hashedPassword, role]
        );

        const user = newUser.rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Користувач створений успішно',
            token,
        });
    } catch (error) {
        console.error('❌ Помилка при реєстрації:', error);
        res.status(500).json({ message: 'Щось пішло не так' });
    }
};

export const registerUser = async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        if (role === 'admin' || role === 'superadmin') {
            return res.status(403).json({ message: 'Створення адміністратора заборонене' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
            [name, email, hashedPassword, role]
        );

        const user = newUser.rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Користувач створений успішно',
            token
        });

    } catch (error) {
        console.error('❌ Помилка при реєстрації:', error);
        res.status(500).json({ message: 'Щось пішло не так' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('📥 req.body:', req.body);

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Невірна електронна пошта або пароль' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Невірна електронна пошта або пароль' });
        }

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });

    } catch (error) {
        console.error('Помилка при логіні:', error);
        res.status(500).json({ message: 'Щось пішло не так' });
    }
};

export const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const user = userResult.rows[0];
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Надіслати листа (використовуємо nodemailer + Gmail або Mailtrap)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:5173/reset-password/${token}`;

        await transporter.sendMail({
            to: email,
            subject: 'Скидання пароля',
            html: `<p>Натисніть на <a href="${resetLink}">це посилання</a>, щоб скинути пароль.</p>`,
        });

        res.status(200).json({ message: 'Лист із скиданням пароля надіслано' });
    } catch (err) {
        console.error('❌ Помилка при надсиланні листа:', err);
        res.status(500).json({ message: 'Щось пішло не так' });
    }
};

export const resetPasswordConfirm = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [
            hashedPassword,
            decoded.id,
        ]);

        res.status(200).json({ message: 'Пароль успішно змінено' });
    } catch (err) {
        console.error('❌ Помилка при скиданні пароля:', err);
        res.status(400).json({ message: 'Недійсний або прострочений токен' });
    }
};