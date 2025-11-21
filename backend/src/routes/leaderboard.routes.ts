import { Router } from "express";
import { LeaderboardController } from "../controllers/leaderboard.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @route   GET /api/leaderboard
 * @desc    Récupérer le classement complet des contributeurs
 * @access  Privé (JWT requis)
 */
router.get("/", authMiddleware, LeaderboardController.getLeaderboard);

/**
 * @route   GET /api/leaderboard/me
 * @desc    Récupérer le rang de l'utilisateur connecté
 * @access  Privé (JWT requis)
 */
router.get("/me", authMiddleware, LeaderboardController.getMyRank);

export default router;