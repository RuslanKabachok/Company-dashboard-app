import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API працює 🚀');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
