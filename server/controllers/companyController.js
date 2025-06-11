import pool from '../config/db.js';

export const createCompany = async (req, res) => {
    const { name, service, capital } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'INSERT INTO companies (user_id, name, service, capital) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, name, service, capital]
        );

        res.status(201).json({ message: 'Компанію створено', company: result.rows[0] });
    } catch (error) {
        console.error('Помилка при створенні компанії:', error);
        res.status(500).json({ message: 'Не вдалося створити компанію' });
    }
};

export const getCompany = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM companies WHERE user_id = $1',
            [userId]
        );
        res.status(200).json({ companies: result.rows });
    } catch (error) {
        console.error('Помилка при отриманні компаній:', error);
        res.status(500).json({ message: 'Не вдалося отримати список компаній' });
    }
}

export const deleteCompany = async (req, res) => {
    const userId = req.user.id;
    const companyId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT * FROM companies WHERE id = $1 AND user_id = $2',
            [companyId, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Компанію не знайдено або доступ заборонено' });
        }

        await pool.query('DELETE FROM companies WHERE id = $1', [companyId]);

        res.status(200).json({ message: 'Компанію видалено' });
    } catch (error) {
        console.error('Помилка при видаленні компанії:', error);
        res.status(500).json({ message: 'Не вдалося видалити компанію' });
    }
}

export const getCompanyById = async (req, res) => {
    const companyId = req.params.id;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM companies WHERE id = $1 AND user_id = $2',
            [companyId, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Компанію не знайдено або доступ заборонено' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Помилка при отриманні компанії:', error);
        res.status(500).json({ message: 'Не вдалося отримати компанію' });
    }
}