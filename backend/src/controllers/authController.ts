import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
import prisma from '../utils/prisma.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError(res, 'Email already registered', 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(
      res,
      { user, accessToken, refreshToken },
      'Registration successful',
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return sendError(res, 'Registration failed', 500);
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (user.status !== 'ACTIVE') {
      return sendError(res, 'Account is not active', 403);
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return sendSuccess(
      res,
      { user: userWithoutPassword, accessToken, refreshToken },
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 'Login failed', 500);
  }
};

export const refresh = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 'Refresh token required', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded || typeof decoded === 'string') {
      return sendError(res, 'Invalid or expired refresh token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.status !== 'ACTIVE') {
      return sendError(res, 'User not found or inactive', 401);
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed');
  } catch (error) {
    console.error('Refresh error:', error);
    return sendError(res, 'Token refresh failed', 500);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, user);
  } catch (error) {
    console.error('GetMe error:', error);
    return sendError(res, 'Failed to fetch user', 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, user, 'Profile updated successfully');
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return sendError(res, 'Failed to update profile', 500);
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const isValidPassword = await comparePassword(currentPassword, user.passwordHash);

    if (!isValidPassword) {
      return sendError(res, 'Current password is incorrect', 401);
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { passwordHash: newPasswordHash },
    });

    return sendSuccess(res, null, 'Password updated successfully');
  } catch (error) {
    console.error('UpdatePassword error:', error);
    return sendError(res, 'Failed to update password', 500);
  }
};
