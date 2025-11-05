import { Router } from "express";
import { ConsumptionController } from "../controllers/consumption.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const consumptionController = new ConsumptionController();

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

/**
 * POST /api/consumptions
 * Créer une nouvelle consommation pour Amed
 * Body: { barcode, name, quantity, calories_100g, sugar_100g, caffeine_100g, place?, note?, when? }
 */
router.post("/", consumptionController.createConsumption.bind(consumptionController));

/**
 * GET /api/consumptions/:id
 * Récupérer une consommation spécifique
 */
router.get("/:id", consumptionController.getConsumptionById.bind(consumptionController));

/**
 * PUT /api/consumptions/:id
 * Modifier une consommation (seulement ses propres contributions)
 * Body: { quantity?, place?, note?, when? }
 */
router.put("/:id", consumptionController.updateConsumption.bind(consumptionController));

/**
 * DELETE /api/consumptions/:id
 * Supprimer une consommation (seulement ses propres contributions)
 */
router.delete("/:id", consumptionController.deleteConsumption.bind(consumptionController));

export default router;