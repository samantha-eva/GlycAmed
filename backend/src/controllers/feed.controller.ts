import { Request, Response } from "express";
import { FeedService } from "../services/feed.service";

export class FeedController {
  /**
   * GET /api/feed
   * GET /api/feed?limit=50
   * Récupérer le feed d'activité en temps réel
   */
  static async getFeed(req: Request, res: Response): Promise<void> {
    try {
      // Récupérer le paramètre limit depuis la query string (défaut: 20)
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      // Validation du limit
      if (isNaN(limit) || limit < 1 || limit > 100) {
        res.status(400).json({
          error: "Le paramètre 'limit' doit être un nombre entre 1 et 100",
        });
        return;
      }

      const feed = await FeedService.getFeed(limit);

      res.status(200).json(feed);
    } catch (error) {
      console.error("❌ Erreur récupération feed:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération du feed",
      });
    }
  }
}