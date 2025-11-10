import { Request, Response } from "express";
import { DashboardService } from "../services/dasboard.Service";

export class DashboardController {
  /**
   * GET /api/dashboard/today
   * Récupérer les statistiques du dashboard pour aujourd'hui
   */
  static async getDashboardToday(_req: Request, res: Response): Promise<void> {
    try {
      const dashboard = await DashboardService.getDashboardToday();

      res.status(200).json(dashboard);
    } catch (error) {
      console.error("❌ Erreur récupération dashboard:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération du dashboard",
      });
    }
  }
}