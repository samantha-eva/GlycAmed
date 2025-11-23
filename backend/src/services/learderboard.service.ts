import { ConsumptionModel } from "../models/consumption";
import { LeaderboardItemDTO } from "../types/dtos";

export class LeaderboardService {
  /**
   * Récupérer le classement des contributeurs
   */
  static async getLeaderboard(): Promise<LeaderboardItemDTO[]> {
    // Agrégation MongoDB pour compter les contributions par utilisateur
    const leaderboard = await ConsumptionModel.aggregate([
      {
        // Grouper par utilisateur
        $group: {
          _id: "$users_id",
          contributionsCount: { $sum: 1 },
          lastContribution: { $max: "$created_at" },
        },
      },
      {
        // Joindre avec la collection users pour récupérer nom/prénom
        $lookup: {
          from: "users", // Nom de la collection users dans MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        // Dérouler le tableau user (il contient 1 seul élément)
        $unwind: "$user",
      },
      {
        // Projeter les champs voulus
        $project: {
          userId: "$_id",
          name: "$user.name",
          surname: "$user.surname",
          contributionsCount: 1,
          lastContribution: 1,
        },
      },
      {
        // Trier par nombre de contributions (décroissant)
        $sort: { contributionsCount: -1 },
      },
    ]);

    // Mapper vers le DTO avec badges et rangs
    return leaderboard.map((item, index) => ({
      rank: index + 1,
      userId: item.userId.toString(),
      name: item.name,
      surname: item.surname,
      contributionsCount: item.contributionsCount,
      lastContribution: item.lastContribution,
      badge: this.getBadge(index, item.contributionsCount),
    }));
  }

  /**
   * Attribuer un badge selon le rang et le nombre de contributions
   */
  private static getBadge(rank: number, count: number): string | undefined {
    // Badges spéciaux pour le top 3
    if (rank === 0 && count >= 10) {
      return "🥇 Top contributeur";
    }
    if (rank === 1 && count >= 5) {
      return "🥈 Super contributeur";
    }
    if (rank === 2 && count >= 3) {
      return "🥉 Bon contributeur";
    }

    // Badges basés sur le nombre de contributions
    if (count >= 20) {
      return "🔥 Observateur expert";
    }
    if (count >= 10) {
      return "👀 Observateur actif";
    }
    if (count >= 5) {
      return "⭐ Observateur régulier";
    }
    if (count >= 1) {
      return "👋 Nouveau contributeur";
    }

    return undefined;
  }

  /**
   * Récupérer le rang d'un utilisateur spécifique
   */
  static async getUserRank(userId: string): Promise<{
    rank: number;
    contributionsCount: number;
    badge?: string;
  } | null> {
    const leaderboard = await this.getLeaderboard();
    const userEntry = leaderboard.find((item) => item.userId === userId);

    if (!userEntry) {
      return null;
    }

    return {
      rank: userEntry.rank,
      contributionsCount: userEntry.contributionsCount,
      badge: userEntry.badge,
    };
  }
}