import express from 'express';
import { signup, login, resetPasswordRequest, resetPasswordConfirm } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPasswordRequest);
router.post('/reset-password/:token', resetPasswordConfirm);


export default router;
