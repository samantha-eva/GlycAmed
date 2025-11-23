import { Request, Response } from "express";
import { LeaderboardService } from "../services/learderboard.service";

export class LeaderboardController {
  /**
   * GET /api/leaderboard
   * Récupérer le classement complet des contributeurs
   */
  static async getLeaderboard(_req: Request, res: Response): Promise<void> {
    try {
      const leaderboard = await LeaderboardService.getLeaderboard();

      res.status(200).json(leaderboard);
    } catch (error) {
      console.error("❌ Erreur récupération leaderboard:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération du classement",
      });
    }
  }

  /**
   * GET /api/leaderboard/me
   * Récupérer le rang de l'utilisateur connecté
   */
  static async getMyRank(_req: Request, res: Response): Promise<void> {
    try {
      // L'userId vient du middleware d'authentification
      const userId = (_req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Non authentifié" });
        return;
      }

      const userRank = await LeaderboardService.getUserRank(userId);

      if (!userRank) {
        res.status(404).json({
          error: "Vous n'avez pas encore contribué",
        });
        return;
      }

      res.status(200).json(userRank);
    } catch (error) {
      console.error("❌ Erreur récupération rang utilisateur:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération de votre rang",
      });
    }
  }
}