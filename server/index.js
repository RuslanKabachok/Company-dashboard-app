import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('API працює 🚀');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});

// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Помилка підключення до бази:', err);
//   } else {
//     console.log('База підключена. Поточний час:', res.rows[0]);
//   }
// });