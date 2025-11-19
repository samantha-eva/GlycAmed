import { ConsumptionModel } from "../models/consumption";
import { StatsDTO, PeriodFilter } from "../types/dtos";

// Limites OMS
const MAX_SUGAR_PER_DAY = 50;
const MAX_CAFFEINE_PER_DAY = 400;

// Type alias pour simplifier
type DailyStatsMap = Map<string, { sugar: number; caffeine: number; calories: number }>;

export class StatsService {
  /**
   * Récupérer les statistiques pour une période donnée
   */
  static async getStatsForPeriod(period: PeriodFilter): Promise<StatsDTO> {
    const { startDate, endDate } = this.getPeriodDates(period);

    // Récupérer toutes les consommations de la période
    const consumptions = await ConsumptionModel.find({
      created_at: { $gte: startDate, $lte: endDate },
    })
      .populate("users_id", "name surname")
      .sort({ created_at: 1 })
      .exec();

    // 1. Grouper par jour
    const dailyStats = this.groupByDay(consumptions);

    // 2. Préparer les données des graphiques
    const chartData = this.prepareChartData(dailyStats, period);

    // 3. Calculer les agrégats
    const aggregates = this.calculateAggregates(dailyStats, consumptions);

    return {
      period,
      charts: chartData,
      aggregates
    };
  }

  /**
   * Calculer les dates de début et fin selon la période
   */
  private static getPeriodDates(period: PeriodFilter): {
    startDate: Date;
    endDate: Date;
  } {
    const now = new Date();
    const endDate = new Date(now);
    let startDate: Date;

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;

      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;

      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;

      case "6months":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 6);
        break;

      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;

      default:
        startDate = new Date(0);
    }

    return { startDate, endDate };
  }

  /**
   * Grouper les consommations par jour
   */
  private static groupByDay(consumptions: any[]): DailyStatsMap {
    const dailyStats: DailyStatsMap = new Map();

    consumptions.forEach((c) => {
      const dateKey = c.created_at.toISOString().split("T")[0];
      const existing = dailyStats.get(dateKey);
      
      if (existing) {
        existing.sugar += c.sugar;
        existing.caffeine += c.caffeine;
        existing.calories += c.calories;
      } else {
        dailyStats.set(dateKey, {
          sugar: c.sugar,
          caffeine: c.caffeine,
          calories: c.calories,
        });
      }
    });

    return dailyStats;
  }

  /**
   * Préparer les données pour les graphiques
   */
  private static prepareChartData(
    dailyStats: DailyStatsMap,
    period: PeriodFilter,
  ): {
    sugar: { labels: string[]; values: number[] };
    caffeine: { labels: string[]; values: number[] };

  } {
    const labels: string[] = [];
    const sugarValues: number[] = [];
    const caffeineValues: number[] = [];

    const sortedEntries = Array.from(dailyStats.entries()).sort(
      (a, b) => a[0].localeCompare(b[0])
    );

    sortedEntries.forEach(([date, stats]) => {
      labels.push(this.formatDateLabel(date, period));
      sugarValues.push(Math.round(stats.sugar * 10) / 10);
      caffeineValues.push(Math.round(stats.caffeine));
    });


    return {
      sugar: { labels, values: sugarValues },
      caffeine: { labels, values: caffeineValues },
    };
  }

  /**
   * Formater les labels de date selon la période
   */
  private static formatDateLabel(dateString: string, period: PeriodFilter): string {
    const date = new Date(dateString);
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    switch (period) {
      case "today":
        return `${date.getHours()}h`;

      case "week":
        return days[date.getDay()];

      case "month":
        return `${date.getDate()} ${months[date.getMonth()]}`;

      case "6months":
      case "year":
        return `${months[date.getMonth()]} ${date.getFullYear()}`;

      default:
        return `${date.getDate()}/${date.getMonth() + 1}`;
    }
  }

  /**
   * Calculer les agrégats
   */
  private static calculateAggregates(
    dailyStats: DailyStatsMap,
    consumptions: any[]
  ): {
    avgDailySugar: number;
    avgDailyCaffeine: number;
    totalCalories: number;
    daysExceeded: number;
    totalDays: number;
  } {
    const days = Array.from(dailyStats.values());
    const totalDays = days.length || 1;

    const totalSugar = days.reduce((sum, d) => sum + d.sugar, 0);
    const totalCaffeine = days.reduce((sum, d) => sum + d.caffeine, 0);
    const totalCalories = consumptions.reduce((sum, c) => sum + c.calories, 0);

    const avgDailySugar = totalSugar / totalDays;
    const avgDailyCaffeine = totalCaffeine / totalDays;

    const daysExceeded = days.filter(
      (d) => d.sugar > MAX_SUGAR_PER_DAY || d.caffeine > MAX_CAFFEINE_PER_DAY
    ).length;

    return {
      avgDailySugar: Math.round(avgDailySugar * 10) / 10,
      avgDailyCaffeine: Math.round(avgDailyCaffeine),
      totalCalories: Math.round(totalCalories),
      daysExceeded,
      totalDays,
    };
  }

}