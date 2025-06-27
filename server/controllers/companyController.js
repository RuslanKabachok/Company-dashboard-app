import pool from '../config/db.js';

export const createCompany = async (req, res) => {
    const { name, service, capital } = req.body;
    const userId = req.user.id;
    const logoPath = req.file ? `uploads/${req.file.filename}` : null;

    try {
        const result = await pool.query(
            'INSERT INTO companies (user_id, name, service, capital, logo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, name, service, capital, logoPath]
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
    const userRole = req.user.role;
    const companyId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM companies WHERE id = $1', [companyId]);
        const company = result.rows[0];
        if (!company) return res.status(404).json({ message: 'Компанію не знайдено' });

        if (company.user_id !== userId && userRole !== 'superadmin') {
            return res.status(403).json({ message: 'Немає доступу' });
        }

        await pool.query('DELETE FROM companies WHERE id = $1', [companyId]);
        res.status(200).json({ message: 'Компанію видалено' });
    } catch (error) {
        console.error('❌ Помилка при видаленні компанії:', error);
        res.status(500).json({ message: 'Щось пішло не так' });
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

export const updateCompany = async (req, res) => {
    const companyId = req.params.id;
    const userId = req.user.id;
    const { name, service, capital } = req.body;
    const logo = req.file ? `uploads/${req.file.filename}` : null;

    try {
        const check = await pool.query(
            'SELECT * FROM companies WHERE id = $1 AND user_id = $2',
            [companyId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(403).json({ message: 'Компанію не знайдено або доступ заборонено' });
        }

        const updates = [];
        const values = [];
        let i = 1;

        if (name !== undefined) {
            updates.push(`name = $${i++}`);
            values.push(name);
        }

        if (service !== undefined) {
            updates.push(`service = $${i++}`);
            values.push(service);
        }

        if (capital !== undefined) {
            updates.push(`capital = $${i++}`);
            values.push(capital);
        }

        if (logo !== null) {
            updates.push(`logo = $${i++}`);
            values.push(logo);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'Немає даних для оновлення' });
        }

        values.push(companyId, userId);

        const result = await pool.query(
            `UPDATE companies SET ${updates.join(', ')} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
            values
        );

        res.status(200).json({
            message: 'Компанію оновлено',
            company: result.rows[0],
        });

    } catch (error) {
        console.error('Помилка при оновленні компанії:', error);
        res.status(500).json({ message: 'Не вдалося оновити компанію' });
    }
};

export const getUserCompanies = async (req, res) => {
    const userId = req.user.id;
    const { filter = '', sort = '' } = req.query;

    try {
        let query = `
      SELECT * FROM companies 
        WHERE user_id = $1
    `;
        const values = [userId];
        let i = 2;

        if (filter) {
            query += ` AND (name ILIKE $${i} OR service ILIKE $${i})`;
            values.push(`%${filter}%`);
            i++;
        }

        if (sort === 'name') {
            query += ' ORDER BY name ASC';
        } else if (sort === 'capital') {
            query += ' ORDER BY capital DESC NULLS LAST';
        }

        const result = await pool.query(query, values);

        res.status(200).json({ companies: result.rows });
    } catch (error) {
        console.error('❌ DB error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Не вдалося отримати компанії' });
        }
    }
};

export const filterAndSortCompanies = async (req, res) => {
    const userId = req.user.id;

    const {
        sortBy = 'created_at',
        order = 'desc',
        minCapital,
        maxCapital,
        dateFrom,
        dateTo,
    } = req.query;

    let query = 'SELECT * FROM companies WHERE user_id = $1';
    const values = [userId];
    let i = 2;

    if (minCapital) {
        query += ` AND capital >= $${i}`;
        values.push(minCapital);
        i++;
    }

    if (maxCapital) {
        query += ` AND capital <= $${i}`;
        values.push(maxCapital);
        i++;
    }

    if (dateFrom) {
        query += ` AND created_at >= $${i}`;
        values.push(dateFrom);
        i++;
    }

    if (dateTo) {
        query += ` AND created_at <= $${i}`;
        values.push(dateTo);
        i++;
    }

    const validSortFields = ['name', 'service', 'created_at'];
    const validOrder = ['asc', 'desc'];

    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = validOrder.includes(order.toLowerCase()) ? order.toLowerCase() : 'desc';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    try {
        const result = await pool.query(query, values);
        res.status(200).json({ companies: result.rows });
    } catch (error) {
        console.error('Помилка при фільтрації:', error);
        res.status(500).json({ message: 'Не вдалося отримати компанії' });
    }
}