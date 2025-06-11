import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);

export default router;
