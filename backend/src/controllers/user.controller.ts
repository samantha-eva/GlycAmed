import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UpdateUserDTO } from '../types/dtos';

export class UserController {
  
  // GET /api/users
static async getAllUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}


  // GET /api/users/:id
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  // PUT /api/users/:id
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateUserDTO = req.body;
      const updatedUser = await UserService.updateUser(id, data);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // DELETE /api/users/:id
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}