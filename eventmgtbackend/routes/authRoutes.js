import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// signup route
router.post('/register', registerUser);

// login route
router.post('/login', loginUser);

export default router;
