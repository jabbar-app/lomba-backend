import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/database';
import { AppError } from '../utils/appError';
import { sendEmail } from '../utils/email';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, firstName, lastName, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new AppError('User with this email or username already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 12);

    // Generate email verification token
    const emailToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        password: hashedPassword,
        emailToken
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        verified: true,
        createdAt: true
      }
    });

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2>Welcome to Luma! 🎉</h2>
          <p>Thanks for signing up. Please verify your email address to get started.</p>
          <a href="${process.env.FRONTEND_URL}/verify-email?token=${emailToken}" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link: ${process.env.FRONTEND_URL}/verify-email?token=${emailToken}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
    });

    logger.info(`User registered: ${user.id} (${email})`);
    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Remove sensitive data
    const { password: _, refreshToken: __, emailToken: ___, ...userResponse } = user;

    logger.info(`User logged in: ${user.id} (${email})`);
    res.json({
      message: 'Login successful',
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    
    // Find user and verify stored refresh token
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        refreshToken
      }
    });

    if (!user) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    // Update stored refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    res.json(tokens);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid refresh token', 401));
    }
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Clear refresh token
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null }
    });

    logger.info(`User logged out: ${req.user.id}`);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        phone: true,
        location: true,
        website: true,
        verified: true,
        createdAt: true,
        _count: {
          select: {
            hostedEvents: true,
            attendances: { where: { status: 'GOING' } },
            followers: true,
            follows: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    const user = await prisma.user.findFirst({
      where: { emailToken: token }
    });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        emailToken: null
      }
    });

    logger.info(`Email verified for user: ${user.id}`);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetExpires
      }
    });

    // Send reset email
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your Luma account.</p>
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    logger.info(`Password reset requested for user: ${user.id}`);
    res.json({ message: 'If an account with that email exists, we sent a password reset link.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gt: new Date() }
      }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 12);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null,
        refreshToken: null // Force re-login
      }
    });

    logger.info(`Password reset for user: ${user.id}`);
    res.json({ message: 'Password reset successful. Please log in with your new password.' });
  } catch (error) {
    next(error);
  }
};