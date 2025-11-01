import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/dtos';

const JWT_SECRET = (process.env.JWT_SECRET || 'fallback_secret_dev_only') as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as string;

export const generateToken = (userId: string): string => {
  const payload: JWTPayload = {
    userId,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};