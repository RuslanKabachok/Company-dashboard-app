import pool from '../config/db.js';

export const getAllCompanies = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies');
        res.status(200).json({ companies: result.rows });
    } catch (error) {
        console.error('❌ Помилка при отриманні всіх компаній:', error);
        res.status(500).json({ message: 'Не вдалося отримати компанії' });
    }
};
