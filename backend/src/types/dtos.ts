// ========================================
// DTOs pour l'AUTHENTIFICATION
// ========================================

export interface RegisterDTO {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
}

export interface UserProfileDTO {
  id: string;
  name: string;
  surname: string;
  email: string;
  created_at: Date;
}

export interface UpdateUserDTO {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
}

// ========================================
// Types utilitaires
// ========================================

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}