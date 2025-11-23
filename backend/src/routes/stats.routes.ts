import { Router } from "express";
import { StatsController } from "../controllers/stats.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @route   GET /api/stats/:period
 * @desc    Récupérer les statistiques pour une période donnée
 * @param   period - today | week | month | 6months | year
 * @access  Privé (JWT requis)
 */
router.get("/:period", authMiddleware, StatsController.getStats);

export default router;