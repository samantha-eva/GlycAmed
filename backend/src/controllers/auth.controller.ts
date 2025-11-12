import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../types/dtos';

export class AuthController {
  
  // POST /api/auth/register
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterDTO = req.body;
      const result = await AuthService.register(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginDTO = req.body;
      const result = await AuthService.login(data);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }



}