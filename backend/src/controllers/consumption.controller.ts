import { Request, Response } from "express";
import { ConsumptionService } from "../services/consumption.service";
import {
  CreateConsumptionDTO,
  UpdateConsumptionDTO,
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


}