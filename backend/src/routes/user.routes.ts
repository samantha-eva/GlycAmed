import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// GET tous les utilisateurs
router.get('/', UserController.getAllUsers);

// GET un utilisateur par ID
router.get('/:id', UserController.getUserById);

// PUT modifier un utilisateur
router.put('/:id', UserController.updateUser);

// DELETE supprimer un utilisateur
router.delete('/:id', UserController.deleteUser);


export default router;