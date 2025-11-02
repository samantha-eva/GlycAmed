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

// ========================================
// DTOs pour OPEN FOOD FACTS
// ========================================

// Ce que l'API Open Food Facts renvoie
export interface OpenFoodFactsResponse {
  code: string;
  product?: {
    product_name?: string;
    product_name_fr?: string;
    brands?: string;
    image_url?: string;
    image_front_url?: string;
    nutriments?: {
      'energy-kcal_100g'?: number;
      'energy-kcal'?: number;
      'sugars_100g'?: number;
      sugars?: number;
      'caffeine_100g'?: number;
      caffeine?: number;
    };
    serving_size?: string;
    quantity?: string;
  };
  status: number;
  status_verbose?: string;
}

 
export interface ProductSearchResultDTO {
  barcode: string;
  name: string;
  brand?: string;
  image_url?: string;
  calories_100g: number;
  sugar_100g: number;
  caffeine_100g: number;
  serving_size?: string;
  quantity?: string;
}

// DTO pour rechercher un produit
export interface SearchProductDTO {
  barcode?: string;
  name?: string;
}