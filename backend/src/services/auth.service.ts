import { UserModel } from '../models/user';
import { RegisterDTO, LoginDTO, AuthResponseDTO } from '../types/dtos';
import { generateToken } from '../utils/jwt';

export class AuthService {
  
  // Inscription
  static async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    // Vérifier si l'email existe déjà
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    const user = new UserModel({
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
    });
    
    await user.save();

    // Générer le token JWT
    const token = generateToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    };
  }

  // Connexion
  static async login(data: LoginDTO): Promise<AuthResponseDTO> {
    // Chercher l'utilisateur par email
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = generateToken(user._id.toString());

    // Retourner la réponse
    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    };
  }
}