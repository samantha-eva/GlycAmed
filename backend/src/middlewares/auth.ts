import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { JWTPayload } from '../types/dtos';

// Étendre le type Request pour inclure userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token manquant' });
      return;
    }

    // Extraire le token
    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier le token
    const payload: JWTPayload = verifyToken(token);

    // Ajouter userId à la requête
    req.userId = payload.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};