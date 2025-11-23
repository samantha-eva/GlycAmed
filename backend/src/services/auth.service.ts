import { UserModel } from '../models/user';
import { RegisterDTO, LoginDTO, AuthResponseDTO } from '../types/dtos';
import { generateToken } from '../utils/jwt';
import { extractNameFromEmail } from '../utils/nameExtractor';

export class AuthService {
  /**
   * Inscription
   * Si name/surname ne sont pas fournis, ils sont extraits de l'email
   */
  static async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    // Vérifier si l'email existe déjà
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // ✨ NOUVELLE LOGIQUE : Extraire name/surname si non fournis
    let name = data.name;
    let surname = data.surname;
    
    if (!name || !surname) {
      const extracted = extractNameFromEmail(data.email);
      name = name || extracted.name;
      surname = surname || extracted.surname;
    }

    // Créer l'utilisateur
    const user = new UserModel({
      name,
      surname,
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

  // Connexion (pas de changement)
  static async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

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
}