import { UserModel } from '../models/user';
import { UserProfileDTO, UpdateUserDTO } from '../types/dtos';

export class UserService {
  
  // GET tous les utilisateurs
  static async getAllUsers(): Promise<UserProfileDTO[]> {
    const users = await UserModel.find()
      .select('name surname email created_at') // SELECT name, surname, email, created_at
      .sort({ created_at: -1 }); // Les plus récents en premier

    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      created_at: user.created_at,
    }));
  }

  // GET un utilisateur par ID
  static async getUserById(userId: string): Promise<UserProfileDTO> {
    const user = await UserModel.findById(userId)
      .select('name surname email created_at');

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      created_at: user.created_at,
    };
  }

  // PUT modifier un utilisateur
  static async updateUser(userId: string, data: UpdateUserDTO): Promise<UserProfileDTO> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Mettre à jour les champs fournis
    if (data.name) user.name = data.name;
    if (data.surname) user.surname = data.surname;
    if (data.email) {
      // Vérifier si le nouvel email existe déjà
      const existingUser = await UserModel.findOne({ email: data.email });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error('Cet email est déjà utilisé');
      }
      user.email = data.email;
    }
    if (data.password) {
      user.password = data.password; // Sera hashé par le hook pre('save')
    }

    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      created_at: user.created_at,
    };
  }

  // DELETE supprimer un utilisateur
  static async deleteUser(userId: string): Promise<void> {
    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
  }
}