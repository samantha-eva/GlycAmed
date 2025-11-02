import { Request, Response } from 'express';
import { OpenFoodFactsService } from '../services/openfoodfacts.service';

export class ProductController {
  
  /**
   * GET /api/products/search/:barcode
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
      const { barcode, quantity } = req.body;

      if (!barcode || !quantity) {
        res.status(400).json({ error: 'Code-barres et quantité requis' });
        return;
      }

      if (quantity <= 0) {
        res.status(400).json({ error: 'La quantité doit être supérieure à 0' });
        return;
      }

      // Rechercher le produit
      const product = await OpenFoodFactsService.searchByBarcode(barcode);

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