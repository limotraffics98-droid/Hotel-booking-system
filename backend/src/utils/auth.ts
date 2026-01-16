import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload: { id: string; email: string; role: string }): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRY } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: { id: string; email: string; role: string }): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
