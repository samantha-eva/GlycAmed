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

// ========================================
// DTOs pour les CONSOMMATIONS
// ========================================

/**
 * DTO pour créer une consommation
 * Version SIMPLIFIÉE : seuls barcode et quantity sont requis
 * Le reste est automatiquement récupéré depuis Open Food Facts
 */
export interface CreateConsumptionDTO {
  barcode: string;
  name: string;
  quantity: number; // en ml ou g
  place?: string;
  note?: string;
  when?: Date; // Optionnel, par défaut maintenant
}

/**
 * DTO de réponse d'une consommation
 */
export interface ConsumptionResponseDTO {
  id: string;
  contributor: {
    id: string;
    name: string;
    surname: string;
  };
  product: {
    name: string;
    barcode: string;
    brand?: string;
    image_url?: string;
  };
  quantity: number;
  nutrients: {
    calories: number;
    sugar: number;
    caffeine: number;
  };
  place?: string;
  note?: string;
  when: Date;
  created_at: Date;
}

/**
 * DTO pour mettre à jour une consommation
 */
export interface UpdateConsumptionDTO {
  quantity?: number;
  place?: string;
  note?: string;
  when?: Date;
}

// ========================================
// NOUVEAUX DTOs pour les filtres et nutriments
// ========================================

/**
 * Type littéral pour les périodes de filtrage
 */
export type PeriodFilter = 'today' | 'week' | 'month' | '6months' | 'year';

/**
 * DTO pour les paramètres de query des consommations
 */
export interface ConsumptionQueryDTO {
  period?: PeriodFilter;
}

/**
 * DTO pour les données de nutriments
 */
export interface NutrientDataDTO {
  value: number;
  date: Date;
  name: string;
}

/**
 * DTO pour la liste des consommations simplifiée
 */
export interface ConsumptionListItemDTO {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  sugar: number;
  caffeine: number;
  note?: string;
  place: string;
  when: Date;
  created_at: Date;
  contributor?: {
    name: string;
    surname: string;
  };
}

/**
 * Type pour les nutriments possibles
 */
export type NutrientType = 'sugar' | 'caffeine' | 'calories';

// DashboardDTO
export interface DashboardDTO {
  sugar: {
    current: number;
    limit: number;
    percentage: number;
    exceeded: boolean;
  };
  caffeine: {
    current: number;
    limit: number;
    percentage: number;
    exceeded: boolean;
  };
  calories: number;
  contributionsCount: number;
  status: "safe" | "warning" | "danger";
}

// FeedItemDTO
export interface FeedItemDTO {
  id: string;
  contributor: string;
  productName: string;
  quantity: number;
  place: string;
  timeAgo: string;
  nutrients: {
    sugar: number;
    caffeine: number;
    calories: number;
  };
  created_at: Date;
}
