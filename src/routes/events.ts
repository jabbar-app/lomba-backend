// src/routes/events.ts
import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as eventController from '../controllers/eventController';

const router = Router();

// Get events with filtering, search, and pagination
router.get('/', 
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().isString().trim(),
  query('category').optional().isString(),
  query('location').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('priceMin').optional().isNumeric(),
  query('priceMax').optional().isNumeric(),
  query('featured').optional().isBoolean(),
  validateRequest,
  optionalAuth,
  eventController.getEvents
);

// Get trending events
router.get('/trending', eventController.getTrendingEvents);

// Get event by ID
router.get('/:id',
  param('id').isUUID(),
  validateRequest,
  optionalAuth,
  eventController.getEventById
);

// Create event
router.post('/',
  authenticate,
  body('title').trim().isLength({ min: 3, max: 100 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('startDate').isISO8601(),
  body('endDate').optional().isISO8601(),
  body('location').trim().isLength({ min: 3, max: 200 }),
  body('category').isIn(['TECHNOLOGY', 'BUSINESS', 'DESIGN', 'SOCIAL', 'NETWORKING', 'EDUCATION', 'HEALTH', 'SPORTS', 'MUSIC', 'ART', 'FOOD', 'TRAVEL', 'OTHER']),
  body('maxAttendees').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('tags').optional().isArray(),
  validateRequest,
  eventController.createEvent
);

// RSVP to event
router.post('/:id/rsvp',
  authenticate,
  param('id').isUUID(),
  body('status').isIn(['GOING', 'MAYBE', 'NOT_GOING']),
  validateRequest,
  eventController.rsvpToEvent
);

// Like/unlike event
router.post('/:id/like',
  authenticate,
  param('id').isUUID(),
  validateRequest,
  eventController.toggleLikeEvent
);

export default router;