import { ConsumptionModel, ConsumptionDocument } from "../models/consumption";
import { UserModel } from "../models/user";
import { OpenFoodFactsService } from "./openfoodfacts.service";
import { Types } from "mongoose";
import {
  CreateConsumptionDTO,
  ConsumptionResponseDTO,
  UpdateConsumptionDTO,
} from "../types/dtos";

// Limites OMS
const MAX_SUGAR_PER_DAY = 50; // grammes
const MAX_CAFFEINE_PER_DAY = 400; // milligrammes

export class ConsumptionService {
 
  /**
   * Créer une nouvelle consommation
   * Version simplifiée : on récupère automatiquement les infos depuis Open Food Facts
   */
  async createConsumption(
    userId: string,
    data: CreateConsumptionDTO
  ): Promise<ConsumptionResponseDTO> {
    // Récupérer le produit depuis Open Food Facts
    const product = await OpenFoodFactsService.searchByBarcode(data.barcode);

    // Calculer les nutriments
    const calculated = OpenFoodFactsService.calculateNutriments(
      product,
      data.quantity
    );

    // Créer la consommation
    const consumption = await ConsumptionModel.create({
      users_id: new Types.ObjectId(userId),
      name: data.name || product.name,
      barcode: parseInt(data.barcode),
      quantity: data.quantity,
      calories: calculated.calories,
      sugar: calculated.sugar,
      caffeine: calculated.caffeine,
      place: data.place || "Non spécifié",
      note: data.note,
      when: data.when || new Date(),
    });

    return this.formatConsumption(consumption, product.image_url);
  }

  /**
   * Formater une consommation pour la réponse
   */
  private async formatConsumption(
    consumption: ConsumptionDocument,
    imageUrl?: string
  ): Promise<ConsumptionResponseDTO> {
    const user = await UserModel.findById(consumption.users_id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return {
      id: consumption._id.toString(),
      contributor: {
        id: user._id.toString(),
        name: user.name,
        surname: user.surname,
      },
      product: {
        name: consumption.name,
        barcode: consumption.barcode.toString(),
        image_url: imageUrl,
      },
      quantity: consumption.quantity,
      nutrients: {
        calories: consumption.calories,
        sugar: consumption.sugar,
        caffeine: consumption.caffeine,
      },
      place: consumption.place,
      note: consumption.note,
      when: consumption.when,
      created_at: consumption.created_at,
    };
  }

  /**
   * Récupérer une consommation par ID
   */
  async getConsumptionById(id: string): Promise<ConsumptionResponseDTO> {
    const consumption = await ConsumptionModel.findById(id);
    if (!consumption) {
      throw new Error("Consommation non trouvée");
    }
    return this.formatConsumption(consumption);
  }

  /**
   * Mettre à jour une consommation
   */
  async updateConsumption(
    id: string,
    userId: string,
    data: UpdateConsumptionDTO
  ): Promise<ConsumptionResponseDTO> {
    const consumption = await ConsumptionModel.findById(id);
    if (!consumption) {
      throw new Error("Consommation non trouvée");
    }

    // Vérifier que l'utilisateur est le créateur
    if (consumption.users_id.toString() !== userId) {
      throw new Error("Non autorisé à modifier cette consommation");
    }

    // Si la quantité change, recalculer les nutriments
    if (data.quantity && data.quantity !== consumption.quantity) {
      const ratio = data.quantity / consumption.quantity;
      consumption.quantity = data.quantity;
      consumption.calories *= ratio;
      consumption.sugar *= ratio;
      consumption.caffeine *= ratio;
    }

    if (data.place !== undefined) consumption.place = data.place;
    if (data.note !== undefined) consumption.note = data.note;
    if (data.when !== undefined) consumption.when = data.when;

    await consumption.save();
    return this.formatConsumption(consumption);
  }

  /**
   * Supprimer une consommation
   */
  async deleteConsumption(id: string, userId: string): Promise<void> {
    const consumption = await ConsumptionModel.findById(id);
    if (!consumption) {
      throw new Error("Consommation non trouvée");
    }

    // Vérifier que l'utilisateur est le créateur
    if (consumption.users_id.toString() !== userId) {
      throw new Error("Non autorisé à supprimer cette consommation");
    }

    await ConsumptionModel.findByIdAndDelete(id);
  }

}