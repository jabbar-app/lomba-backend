// src/routes/auth.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Placeholder auth routes - controllers to be implemented
router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('firstName').trim().isLength({ min: 1, max: 50 }),
  body('lastName').trim().isLength({ min: 1, max: 50 }),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  validateRequest,
  (req, res) => res.json({ message: 'Register endpoint - to be implemented' })
);

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  validateRequest,
  (req, res) => res.json({ message: 'Login endpoint - to be implemented' })
);

router.post('/refresh',
  body('refreshToken').exists(),
  validateRequest,
  (req, res) => res.json({ message: 'Refresh token endpoint - to be implemented' })
);

router.post('/logout', authenticate, (req, res) => res.json({ message: 'Logout endpoint - to be implemented' }));

router.get('/me', authenticate, (req, res) => res.json({ message: 'Get current user endpoint - to be implemented' }));

export default router;