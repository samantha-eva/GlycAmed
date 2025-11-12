import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @route   GET /api/dashboard/today
 * @desc    Récupérer les statistiques du dashboard d'aujourd'hui
 * @access  Privé (JWT requis)
 */
router.get("/today", authMiddleware, DashboardController.getDashboardToday);

export default router;