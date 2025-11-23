import { ConsumptionModel } from "../models/consumption";
import { FeedItemDTO } from "../types/dtos";

export class FeedService {
  /**
   * Récupérer le feed d'activité en temps réel
   * @param limit - Nombre maximum d'éléments à retourner (défaut: 20)
   */
  static async getFeed(limit: number = 20): Promise<FeedItemDTO[]> {
    // Récupérer les consommations triées par date décroissante
    const consumptions = await ConsumptionModel.find()
      .populate("users_id", "name surname") // Joindre les infos utilisateur
      .sort({ created_at: -1 }) // Plus récent en premier
      .limit(limit)
      .exec();

    // Mapper vers le DTO
    return consumptions.map((consumption) => {
      const user = consumption.users_id as any;
      
      return {
        id: consumption._id.toString(),
        contributor: user ? `${user.name} ${user.surname}` : "Utilisateur inconnu",
        productName: consumption.name,
        quantity: consumption.quantity,
        place: consumption.place,
        timeAgo: this.getTimeAgo(consumption.created_at),
        nutrients: {
          sugar: Math.round(consumption.sugar * 10) / 10,
          caffeine: Math.round(consumption.caffeine * 10) / 10,
          calories: Math.round(consumption.calories),
        },
        created_at: consumption.created_at,
      };
    });
  }

  /**
   * Calculer le temps écoulé depuis une date ("il y a X min/h/j")
   */
  private static getTimeAgo(date: Date): string {
    const now = Date.now();
    const past = date.getTime();
    const seconds = Math.floor((now - past) / 1000);

    // Moins d'une minute
    if (seconds < 60) {
      return "à l'instant";
    }

    // Moins d'une heure
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `il y a ${minutes} min`;
    }

    // Moins d'un jour
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `il y a ${hours}h`;
    }

    // Jours
    const days = Math.floor(hours / 24);
    if (days === 1) {
      return "hier";
    }
    if (days < 7) {
      return `il y a ${days}j`;
    }

    // Semaines
    const weeks = Math.floor(days / 7);
    if (weeks === 1) {
      return "il y a 1 semaine";
    }
    if (weeks < 4) {
      return `il y a ${weeks} semaines`;
    }

    // Mois
    const months = Math.floor(days / 30);
    if (months === 1) {
      return "il y a 1 mois";
    }
    return `il y a ${months} mois`;
  }
}