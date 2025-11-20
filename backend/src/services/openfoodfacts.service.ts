import axios from 'axios';
import { OpenFoodFactsResponse, ProductSearchResultDTO } from '../types/dtos';

export class OpenFoodFactsService {
  private static readonly BASE_URL = 'https://world.openfoodfacts.org/api/v0';
  private static readonly SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
  private static readonly USER_AGENT = 'GlycAmed - Project';

  /**
   * Rechercher des produits par nom
   */
  static async searchByName(productName: string): Promise<ProductSearchResultDTO[]> {
    try {

      const response = await axios.get(this.SEARCH_URL, {
        params: {
          search_terms: productName,
          page_size: 10,
          json: 1
        },
        headers: {
          'User-Agent': this.USER_AGENT,
        },
        timeout: 70000,
      });

      const data = response.data;

      // Vérifier si la réponse est valide
      if (!data || typeof data !== 'object') {
        throw new Error('Réponse invalide de l\'API');
      }

      if (!data.products || data.products.length === 0) {
        throw new Error('Aucun produit trouvé');
      }

      // Transformer les résultats en filtrant les produits invalides
      return data.products
        .filter((product: any) => product && product.code) // Filtrer les produits sans code
        .map((product: any) => {
          const nutriments = product.nutriments || {};
          
          return {
            barcode: product.code || '',
            name: product.product_name || product.product_name_fr || 'Produit sans nom',
            brand: product.brands || undefined,
            image_url: product.image_front_url || product.image_url || undefined,
            calories_100g: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0),
            sugar_100g: Math.round((nutriments['sugars_100g'] || nutriments.sugars || 0) * 10) / 10,
            caffeine_100g: Math.round((nutriments['caffeine_100g'] || nutriments.caffeine || 0) * 10) / 10,
            serving_size: product.serving_size,
            quantity: product.quantity,
          };
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Timeout: l\'API Open Food Facts met trop de temps à répondre. Réessayez avec un nom plus précis.');
        }
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          throw new Error('Impossible de se connecter à Open Food Facts. Vérifiez votre connexion internet.');
        }
        if (error.response?.status === 503) {
          throw new Error('Le service Open Food Facts est temporairement indisponible. Réessayez dans quelques instants.');
        }
        throw new Error(`Erreur lors de la recherche: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Rechercher un produit par code-barres
   */
  static async searchByBarcode(barcode: string): Promise<ProductSearchResultDTO> {
    try {
        
      const url = `${this.BASE_URL}/product/${barcode}.json`;
      const response = await axios.get<OpenFoodFactsResponse>(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'application/json',
        },
        timeout: 15000, // 15 secondes
        validateStatus: (status) => status < 500,
      });

      const data = response.data;

      if (data.status === 0 || !data.product) {
        throw new Error('Produit non trouvé dans la base Open Food Facts');
      }

      const product = data.product;
      const productName = product.product_name || product.product_name_fr || 'Produit sans nom';
      const brand = product.brands || undefined;
      const imageUrl = product.image_front_url || product.image_url || undefined;
      const nutriments = product.nutriments || {};
      const calories100g = nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0;
      const sugar100g = nutriments['sugars_100g'] || nutriments.sugars || 0;
      const caffeine100g = nutriments['caffeine_100g'] || nutriments.caffeine || 0;

      return {
        barcode,
        name: productName,
        brand,
        image_url: imageUrl,
        calories_100g: Math.round(calories100g),
        sugar_100g: Math.round(sugar100g * 10) / 10,
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
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          throw new Error('Impossible de se connecter à Open Food Facts');
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
    return {
      calories: Math.round((product.calories_100g * quantityConsumed) / 100),
      sugar: Math.round((product.sugar_100g * quantityConsumed) / 10) / 10,
      caffeine: Math.round((product.caffeine_100g * quantityConsumed) / 10) / 10,
    };
  }
}