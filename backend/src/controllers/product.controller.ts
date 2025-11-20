import { Request, Response } from 'express';
import { OpenFoodFactsService } from '../services/openfoodfacts.service';

export class ProductController {
  /**
   * GET /api/products/search?name=...
   * Rechercher des produits par nom
   */
  static async searchByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;

      // Validation
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ error: 'Nom du produit requis' });
        return;
      }

      // Recherche des produits
      const products = await OpenFoodFactsService.searchByName(name);

      res.status(200).json({ 
        count: products.length,
        products 
      });
    } catch (error) {
      console.error('Erreur recherche produit:', error);
      res.status(404).json({ error: (error as Error).message });
    }
  }

  /**
   * GET /api/products/barcode/:barcode
   * Rechercher un produit par code-barres
   */
  static async searchByBarcode(req: Request, res: Response): Promise<void> {
    try {
      const { barcode } = req.params;

      // Validation basique
      if (!barcode || barcode.trim().length === 0) {
        res.status(400).json({ error: 'Code-barres requis' });
        return;
      }

      // Recherche du produit
      const product = await OpenFoodFactsService.searchByBarcode(barcode);

      res.status(200).json(product);
    } catch (error) {
      console.error('Erreur recherche produit:', error);
      res.status(404).json({ error: (error as Error).message });
    }
  }

  /**
   * POST /api/products/calculate
   * Calculer les nutriments pour une quantité donnée
   */
  static async calculateNutriments(req: Request, res: Response): Promise<void> {
    try {
      const { barcode, name, quantity } = req.body;

      // Validation
      if (!quantity || quantity <= 0) {
        res.status(400).json({ error: 'Quantité valide requise (> 0)' });
        return;
      }

      let product;

      // Rechercher par code-barres OU par nom
      if (barcode) {
        product = await OpenFoodFactsService.searchByBarcode(barcode);
      } else if (name) {
        const products = await OpenFoodFactsService.searchByName(name);
        if (products.length === 0) {
          res.status(404).json({ error: 'Aucun produit trouvé' });
          return;
        }
        // Prendre le premier résultat
        product = products[0];
      } else {
        res.status(400).json({ error: 'Code-barres ou nom du produit requis' });
        return;
      }

      // Calculer les nutriments
      const nutriments = OpenFoodFactsService.calculateNutriments(product, quantity);

      res.status(200).json({
        product,
        quantity,
        nutriments,
      });
    } catch (error) {
      console.error('Erreur calcul nutriments:', error);
      res.status(404).json({ error: (error as Error).message });
    }
  }
}