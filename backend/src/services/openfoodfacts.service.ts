import axios from 'axios';
import { OpenFoodFactsResponse, ProductSearchResultDTO } from '../types/dtos';

export class OpenFoodFactsService {
  
  private static readonly BASE_URL = 'https://world.openfoodfacts.org/api/v0';
  private static readonly USER_AGENT = 'GlycAmed - Project';

  /**
   * Rechercher un produit par code-barres
   */
  static async searchByBarcode(barcode: string): Promise<ProductSearchResultDTO> {
    try {
      console.log(`🔍 Recherche du produit avec code-barres: ${barcode}`);

      const url = `${this.BASE_URL}/product/${barcode}.json`;
      
      const response = await axios.get<OpenFoodFactsResponse>(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
        },
        timeout: 10000, // 10 secondes
      });

      const data = response.data;

      // Vérifier si le produit existe
      if (data.status === 0 || !data.product) {
        throw new Error('Produit non trouvé dans la base Open Food Facts');
      }

      const product = data.product;

      // Extraire les informations
      const productName = product.product_name || product.product_name_fr || 'Produit sans nom';
      const brand = product.brands || undefined;
      const imageUrl = product.image_front_url || product.image_url || undefined;

      // Extraire les nutriments (pour 100g/100ml)
      const nutriments = product.nutriments || {};
      const calories100g = nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0;
      const sugar100g = nutriments['sugars_100g'] || nutriments.sugars || 0;
      const caffeine100g = nutriments['caffeine_100g'] || nutriments.caffeine || 0;

      console.log(`✅ Produit trouvé: ${productName}`);

      return {
        barcode,
        name: productName,
        brand,
        image_url: imageUrl,
        calories_100g: Math.round(calories100g),
        sugar_100g: Math.round(sugar100g * 10) / 10, // 1 décimale
        caffeine_100g: Math.round(caffeine100g * 10) / 10,
        serving_size: product.serving_size,
        quantity: product.quantity,
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Produit non trouvé');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Timeout: l\'API Open Food Facts ne répond pas');
        }
        throw new Error(`Erreur lors de la recherche: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Calculer les nutriments pour une quantité donnée
   */
  static calculateNutriments(
    product: ProductSearchResultDTO,
    quantityConsumed: number
  ): {
    calories: number;
    sugar: number;
    caffeine: number;
  } {
    // Calcul proportionnel : (valeur_100g * quantité) / 100
    return {
      calories: Math.round((product.calories_100g * quantityConsumed) / 100),
      sugar: Math.round((product.sugar_100g * quantityConsumed) / 10) / 10,
      caffeine: Math.round((product.caffeine_100g * quantityConsumed) / 10) / 10,
    };
  }
}