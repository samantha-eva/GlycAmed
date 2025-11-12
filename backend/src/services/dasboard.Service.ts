import { ConsumptionModel } from "../models/consumption";
import { DashboardDTO } from "../types/dtos";

// Limites OMS
const MAX_SUGAR_PER_DAY = 50; // grammes
const MAX_CAFFEINE_PER_DAY = 400; // milligrammes

export class DashboardService {
  /**
   * Récupérer les données du dashboard pour aujourd'hui
   */
  static async getDashboardToday(): Promise<DashboardDTO> {
    // Définir le début et la fin de la journée
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Agrégation MongoDB pour calculer les totaux du jour
    const stats = await ConsumptionModel.aggregate([
      {
        $match: {
          created_at: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalSugar: { $sum: "$sugar" },
          totalCaffeine: { $sum: "$caffeine" },
          totalCalories: { $sum: "$calories" },
          contributionsCount: { $sum: 1 },
        },
      },
    ]);

    // Si aucune consommation aujourd'hui, retourner des valeurs par défaut
    const data = stats[0] || {
      totalSugar: 0,
      totalCaffeine: 0,
      totalCalories: 0,
      contributionsCount: 0,
    };

    // Calculer les pourcentages
    const sugarPercentage = (data.totalSugar / MAX_SUGAR_PER_DAY) * 100;
    const caffeinePercentage = (data.totalCaffeine / MAX_CAFFEINE_PER_DAY) * 100;

    // Déterminer si les limites sont dépassées
    const sugarExceeded = data.totalSugar > MAX_SUGAR_PER_DAY;
    const caffeineExceeded = data.totalCaffeine > MAX_CAFFEINE_PER_DAY;

    // Calculer le statut global
    let status: "safe" | "warning" | "danger";
    if (sugarExceeded && caffeineExceeded) {
      status = "danger"; // 🚨 Les deux limites dépassées
    } else if (sugarExceeded || caffeineExceeded) {
      status = "warning"; // ⚠️ Une limite dépassée
    } else {
      status = "safe"; // ✅ Tout va bien
    }

    // Construire et retourner le DTO
    return {
      sugar: {
        current: Math.round(data.totalSugar * 10) / 10, // 1 décimale
        limit: MAX_SUGAR_PER_DAY,
        percentage: Math.round(sugarPercentage),
        exceeded: sugarExceeded,
      },
      caffeine: {
        current: Math.round(data.totalCaffeine * 10) / 10, // 1 décimale
        limit: MAX_CAFFEINE_PER_DAY,
        percentage: Math.round(caffeinePercentage),
        exceeded: caffeineExceeded,
      },
      calories: Math.round(data.totalCalories),
      contributionsCount: data.contributionsCount,
      status,
    };
  }
}