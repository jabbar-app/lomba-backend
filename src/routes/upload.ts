// src/routes/upload.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Placeholder upload routes
router.post('/image', authenticate, (req, res) => {
  res.json({ message: 'Image upload endpoint - to be implemented' });
});

router.post('/avatar', authenticate, (req, res) => {
  res.json({ message: 'Avatar upload endpoint - to be implemented' });
});

export default router;