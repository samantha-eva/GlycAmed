import { Request, Response, NextFunction } from 'express';
import { RegisterDTO, LoginDTO } from '../types/dtos';

// Validation pour l'inscription
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body as RegisterDTO;

  const errors: string[] = [];

  if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
    errors.push('Email invalide');
  }

  if (!password || password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  if (errors.length > 0) {
    res.status(400).json({ error: 'Validation échouée', details: errors });
    return;
  }

  next();
};

// Validation pour la connexion
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body as LoginDTO;

  const errors: string[] = [];

  if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
    errors.push('Email invalide');
  }

  if (!password || password.length === 0) {
    errors.push('Le mot de passe est requis');
  }

  if (errors.length > 0) {
    res.status(400).json({ error: 'Validation échouée', details: errors });
    return;
  }

  next();
};

