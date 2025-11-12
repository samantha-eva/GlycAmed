import { Request, Response } from "express";
import { ConsumptionService } from "../services/consumption.service";
import {
  CreateConsumptionDTO,
  UpdateConsumptionDTO,
  PeriodFilter,
} from "../types/dtos";

const consumptionService = new ConsumptionService();

export class ConsumptionController {
  /**
   * POST /api/consumptions
   * Créer une nouvelle consommation
   */
  async createConsumption(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Non authentifié" });
        return;
      }

      const data: CreateConsumptionDTO = req.body;

      // Validation des champs requis
      if (!data.barcode || !data.name || !data.quantity) {
        res.status(400).json({
          error: "Les champs barcode, name et quantity sont requis",
        });
        return;
      }

      if (data.quantity <= 0) {
        res.status(400).json({
          error: "La quantité doit être supérieure à 0",
        });
        return;
      }

      const consumption = await consumptionService.createConsumption(
        userId,
        data,
      );

      res.status(201).json(consumption);
    } catch (error) {
      console.error("Erreur création consommation:", error);
      res.status(500).json({
        error: "Erreur lors de la création de la consommation",
      });
    }
  }


  /**
   * GET /api/consumptions/:id
   * Récupérer une consommation par ID
   */
  async getConsumptionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const consumption = await consumptionService.getConsumptionById(id);
      res.status(200).json(consumption);
    } catch (error) {
      if (error instanceof Error && error.message === "Consommation non trouvée") {
        res.status(404).json({ error: "Consommation non trouvée" });
        return;
      }
      console.error("Erreur récupération consommation:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération de la consommation",
      });
    }
  }

  /**
   * PUT /api/consumptions/:id
   * Mettre à jour une consommation
   */
  async updateConsumption(req: Request, res: Response): Promise<void> {
    try {
     const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Non authentifié" });
        return;
      }

      const { id } = req.params;
      const data: UpdateConsumptionDTO = req.body;

      if (data.quantity && data.quantity <= 0) {
        res.status(400).json({
          error: "La quantité doit être supérieure à 0",
        });
        return;
      }

      const consumption = await consumptionService.updateConsumption(
        id,
        userId,
        data
      );
      res.status(200).json(consumption);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Consommation non trouvée") {
          res.status(404).json({ error: "Consommation non trouvée" });
          return;
        }
        if (error.message === "Non autorisé à modifier cette consommation") {
          res.status(403).json({
            error: "Vous ne pouvez modifier que vos propres contributions",
          });
          return;
        }
      }
      console.error("Erreur mise à jour consommation:", error);
      res.status(500).json({
        error: "Erreur lors de la mise à jour de la consommation",
      });
    }
  }

  /**
   * DELETE /api/consumptions/:id
   * Supprimer une consommation
   */
  async deleteConsumption(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "Non authentifié" });
        return;
      }

      const { id } = req.params;
      await consumptionService.deleteConsumption(id, userId);
      res.status(200).json({ message: "Consommation supprimée avec succès" });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Consommation non trouvée") {
          res.status(404).json({ error: "Consommation non trouvée" });
          return;
        }
        if (error.message === "Non autorisé à supprimer cette consommation") {
          res.status(403).json({
            error: "Vous ne pouvez supprimer que vos propres contributions",
          });
          return;
        }
      }
      console.error("Erreur suppression consommation:", error);
      res.status(500).json({
        error: "Erreur lors de la suppression de la consommation",
      });
    }
  }

  /**
   * GET /api/consumptions
   * Récupérer toutes les consommations avec filtres optionnels
   * Query params: period (today|week|month|6months|year)
   */
  async getAllConsumptions(req: Request, res: Response): Promise<void> {
    try {
      const period = req.query.period as PeriodFilter | undefined;
      
      // Validation du paramètre period
      const validPeriods: PeriodFilter[] = ['today', 'week', 'month', '6months', 'year'];
      if (period && !validPeriods.includes(period)) {
        res.status(400).json({
          error: "Période invalide. Valeurs acceptées: today, week, month, 6months, year"
        });
        return;
      }
      
      const consumptions = await consumptionService.getConsumptions(period);
      
      res.status(200).json(consumptions);
    } catch (error) {
      console.error("Erreur récupération consommations:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération des consommations",
      });
    }
  }

  /**
   * GET /api/consumptions/nutrients/sugar
   * Récupérer uniquement les valeurs de sucre
   */
  async getSugarData(_req: Request, res: Response): Promise<void> {
    try {
      const sugarData = await consumptionService.getNutrientData("sugar");
      res.status(200).json(sugarData);
    } catch (error) {
      console.error("Erreur récupération données sucre:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération des données de sucre",
      });
    }
  }

  /**
   * GET /api/consumptions/nutrients/caffeine
   * Récupérer uniquement les valeurs de caféine
   */
  async getCaffeineData(_req: Request, res: Response): Promise<void> {
    try {
      const caffeineData = await consumptionService.getNutrientData("caffeine");
      res.status(200).json(caffeineData);
    } catch (error) {
      console.error("Erreur récupération données caféine:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération des données de caféine",
      });
    }
  }

  /**
   * GET /api/consumptions/nutrients/calories
   * Récupérer uniquement les valeurs de calories
   */
  async getCaloriesData(_req: Request, res: Response): Promise<void> {
    try {
      const caloriesData = await consumptionService.getNutrientData("calories");
      res.status(200).json(caloriesData);
    } catch (error) {
      console.error("Erreur récupération données calories:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération des données de calories",
      });
    }
  }


}