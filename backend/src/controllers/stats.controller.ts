import { Request, Response } from "express";
import { StatsService } from "../services/stats.service";
import { PeriodFilter } from "../types/dtos";

export class StatsController {
  /**
   * GET /api/stats/:period
   * Récupérer les statistiques pour une période donnée
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { period } = req.params;

      // Validation de la période
      const validPeriods: PeriodFilter[] = [
        "today",
        "week",
        "month",
        "6months",
        "year",
      ];

      if (!validPeriods.includes(period as PeriodFilter)) {
        res.status(400).json({
          error: `Période invalide. Valeurs acceptées: ${validPeriods.join(", ")}`,
        });
        return;
      }

      const stats = await StatsService.getStatsForPeriod(period as PeriodFilter);

      res.status(200).json(stats);
    } catch (error) {
      console.error("❌ Erreur récupération stats:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération des statistiques",
      });
    }
  }
}