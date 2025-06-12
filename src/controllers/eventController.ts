// src/controllers/eventController.ts
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../utils/appError';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const getEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      location,
      startDate,
      endDate,
      priceMin,
      priceMax,
      featured
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: Prisma.EventWhereInput = {
      isPublic: true,
      canceled: false,
      publishedAt: { not: null },
      startDate: { gte: new Date() }
    };

    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { tags: { has: String(search) } }
      ];
    }

    if (category && category !== 'all') {
      where.category = String(category).toUpperCase() as any;
    }

    if (location) {
      where.location = { contains: String(location), mode: 'insensitive' };
    }

    if (startDate) {
      where.startDate = { gte: new Date(String(startDate)) };
    }

    if (endDate) {
      where.startDate = { lte: new Date(String(endDate)) };
    }

    // Handle price filters
    const priceFilter: any = {};
    if (priceMin !== undefined) {
      priceFilter.gte = Number(priceMin);
    }
    if (priceMax !== undefined) {
      priceFilter.lte = Number(priceMax);
    }
    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Get events with relations
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: [
          { featured: 'desc' },
          { startDate: 'asc' }
        ],
        include: {
          host: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              verified: true
            }
          },
          _count: {
            select: {
              rsvps: { where: { status: 'GOING' } },
              likes: true
            }
          },
          likes: req.user ? {
            where: { userId: req.user.id },
            select: { id: true }
          } : false,
          rsvps: req.user ? {
            where: { userId: req.user.id },
            select: { status: true }
          } : false
        }
      }),
      prisma.event.count({ where })
    ]);

    // Format response
    const formattedEvents = events.map(event => ({
      ...event,
      attendeeCount: event._count.rsvps,
      likeCount: event._count.likes,
      isLiked: req.user ? event.likes.length > 0 : false,
      userRSVP: req.user && event.rsvps.length > 0 ? event.rsvps[0].status : null,
      _count: undefined,
      likes: undefined,
      rsvps: undefined
    }));

    res.json({
      events: formattedEvents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verified: true,
            bio: true
          }
        },
        _count: {
          select: {
            rsvps: { where: { status: 'GOING' } },
            likes: true,
            reviews: true
          }
        },
        likes: req.user ? {
          where: { userId: req.user.id },
          select: { id: true }
        } : false,
        rsvps: req.user ? {
          where: { userId: req.user.id },
          select: { status: true }
        } : false,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (!event.isPublic && (!req.user || event.hostId !== req.user.id)) {
      throw new AppError('Event not found', 404);
    }

    // Format response
    const formattedEvent = {
      ...event,
      attendeeCount: event._count.rsvps,
      likeCount: event._count.likes,
      reviewCount: event._count.reviews,
      isLiked: req.user ? event.likes.length > 0 : false,
      userRSVP: req.user && event.rsvps.length > 0 ? event.rsvps[0].status : null,
      _count: undefined,
      likes: undefined,
      rsvps: undefined
    };

    res.json(formattedEvent);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const eventData = {
      ...req.body,
      hostId: req.user.id,
      publishedAt: new Date()
    };

    const event = await prisma.event.create({
      data: eventData,
      include: {
        host: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verified: true
          }
        }
      }
    });

    logger.info(`Event created: ${event.id} by user ${req.user.id}`);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const rsvpToEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: eventId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, maxAttendees: true, currentAttendees: true }
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check capacity
    if (status === 'GOING' && event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      throw new AppError('Event is at full capacity', 400);
    }

    const rsvp = await prisma.rSVP.upsert({
      where: {
        userId_eventId: { userId, eventId }
      },
      update: { status },
      create: {
        userId,
        eventId,
        status
      }
    });

    // Update attendee count
    const goingRsvps = await prisma.rSVP.count({
      where: { eventId, status: 'GOING' }
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { currentAttendees: goingRsvps }
    });

    res.json(rsvp);
  } catch (error) {
    next(error);
  }
};

export const toggleLikeEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_eventId: { userId, eventId }
      }
    });

    let isLiked: boolean;

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      isLiked = false;
    } else {
      await prisma.like.create({
        data: { userId, eventId }
      });
      isLiked = true;
    }

    res.json({ isLiked });
  } catch (error) {
    next(error);
  }
};

export const getTrendingEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
        canceled: false,
        startDate: { gte: new Date() }
      },
      take: 10,
      orderBy: [
        { featured: 'desc' },
        { currentAttendees: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        host: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verified: true
          }
        },
        _count: {
          select: {
            rsvps: { where: { status: 'GOING' } },
            likes: true
          }
        }
      }
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
};