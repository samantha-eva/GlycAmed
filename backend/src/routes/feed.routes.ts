import { Router } from "express";
import { FeedController } from "../controllers/feed.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @route   GET /api/feed
 * @desc    Récupérer le feed d'activité en temps réel
 * @query   limit - Nombre maximum d'éléments (défaut: 20, max: 100)
 * @access  Privé (JWT requis)
 */
router.get("/", authMiddleware, FeedController.getFeed);

export default router;