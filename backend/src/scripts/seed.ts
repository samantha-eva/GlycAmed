import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user";
import { ConsumptionModel } from "../models/consumption";

import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://glycamed_user:t78Yv3vwZO79@localhost:27017/glycamed?authSource=admin";

console.log("🔗 MONGO_URI:", MONGO_URI);

// Faux utilisateurs
const fakeUsers = [
  { name: "Thomas", surname: "Dubois", email: "thomas.dubois@test.fr", password: "password123" },
  { name: "Sarah", surname: "Martin", email: "sarah.martin@test.fr", password: "password123" },
  { name: "Lucas", surname: "Bernard", email: "lucas.bernard@test.fr", password: "password123" },
  { name: "Emma", surname: "Rousseau", email: "emma.rousseau@test.fr", password: "password123" },
  { name: "Alexandre", surname: "Petit", email: "alexandre.petit@test.fr", password: "password123" },
  { name: "Julie", surname: "Durand", email: "julie.durand@test.fr", password: "password123" },
];

// Produits populaires
const products = [
  { name: "Red Bull Energy Drink", barcode: 9002490100070, sugar_100g: 11, caffeine_100g: 32, calories_100g: 45, quantity: 250 },
  { name: "Monster Energy", barcode: 70847811329, sugar_100g: 11, caffeine_100g: 32, calories_100g: 46, quantity: 500 },
  { name: "Coca-Cola", barcode: 5449000000996, sugar_100g: 10.6, caffeine_100g: 10, calories_100g: 42, quantity: 330 },
  { name: "Pepsi", barcode: 5000112637458, sugar_100g: 11, caffeine_100g: 10, calories_100g: 43, quantity: 330 },
  { name: "Fanta Orange", barcode: 5449000000507, sugar_100g: 11.3, caffeine_100g: 0, calories_100g: 45, quantity: 330 },
  { name: "Sprite", barcode: 5449000000453, sugar_100g: 9, caffeine_100g: 0, calories_100g: 37, quantity: 330 },
  { name: "Oasis Tropical", barcode: 3124480186812, sugar_100g: 8.5, caffeine_100g: 0, calories_100g: 40, quantity: 500 },
  { name: "Ice Tea Peach", barcode: 5449000017888, sugar_100g: 7.4, caffeine_100g: 5, calories_100g: 31, quantity: 500 },
];

// Lieux possibles
const places = [
  "Bibliothèque Universitaire",
  "Cafétéria",
  "Distributeur RU",
  "Salle de cours A12",
  "Hall principal",
  "Salle informatique",
  "Parking de l'école",
  "Amphi 200",
  "Foyer étudiant",
  "Terrasse extérieure",
];

// Notes variées
const notes = [
  "Amed avait l'air très fatigué",
  "Il a bu ça d'une traite",
  "Amed révise pour un examen",
  "Entre deux cours",
  "Pendant le TP",
  "Pause déjeuner",
  "Avant de rentrer chez lui",
  "Il en a pris deux d'un coup !",
  "Amed avait mal à la tête",
  "Après le sport",
  "",
  "",
  "",
];

// Fonction utilitaire : nombre aléatoire
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fonction utilitaire : élément aléatoire d'un tableau
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Fonction utilitaire : date aléatoire dans une période
function randomDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.random() * daysAgo;
  const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
  
  // Heure aléatoire entre 8h et 22h
  date.setHours(randomInt(8, 22), randomInt(0, 59), randomInt(0, 59));
  
  return date;
}

async function seed() {
  try {
    console.log("🌱 Démarrage du seed...");

    // Connexion à MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Supprimer les données existantes
    console.log("🗑️  Suppression des données existantes...");
    await UserModel.deleteMany({});
    await ConsumptionModel.deleteMany({});

    // Créer les utilisateurs
    console.log("👥 Création des utilisateurs...");
    const createdUsers = [];
    
    for (const userData of fakeUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await UserModel.create({
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`   ✓ ${user.name} ${user.surname}`);
    }

    // Créer les consommations (90 derniers jours)
    console.log("🥤 Création des consommations...");
    const numberOfConsumptions = 300; // Nombre total de consommations à générer
    
    for (let i = 0; i < numberOfConsumptions; i++) {
      const user = randomItem(createdUsers);
      const product = randomItem(products);
      const place = randomItem(places);
      const note = randomItem(notes);
      const when = randomDate(90); // 90 derniers jours
      
      // Calculer les nutriments
      const quantity = product.quantity;
      const calories = Math.round((product.calories_100g * quantity) / 100);
      const sugar = Math.round((product.sugar_100g * quantity) / 10) / 10;
      const caffeine = Math.round((product.caffeine_100g * quantity) / 10) / 10;

      await ConsumptionModel.create({
        users_id: user._id,
        name: product.name,
        barcode: product.barcode,
        quantity,
        calories,
        sugar,
        caffeine,
        place,
        note,
        when,
        created_at: when,
      });

      if ((i + 1) % 50 === 0) {
        console.log(`   ✓ ${i + 1}/${numberOfConsumptions} consommations créées`);
      }
    }

    console.log(`✅ ${numberOfConsumptions} consommations créées avec succès !`);

    // Afficher les statistiques
    console.log("\n📊 Statistiques :");
    console.log(`   - Utilisateurs : ${createdUsers.length}`);
    console.log(`   - Consommations : ${numberOfConsumptions}`);
    console.log(`   - Période : 90 derniers jours`);
    
    // Compter par utilisateur
    const stats = await ConsumptionModel.aggregate([
      {
        $group: {
          _id: "$users_id",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { count: -1 } },
    ]);

    console.log("\n🏆 Top contributeurs :");
    stats.slice(0, 5).forEach((stat, index) => {
      console.log(`   ${index + 1}. ${stat.user.name} ${stat.user.surname} : ${stat.count} contributions`);
    });

    console.log("\n🎉 Seed terminé avec succès !");
    console.log("\n🔑 Credentials de test :");
    fakeUsers.forEach(user => {
      console.log(`   ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Déconnecté de MongoDB");
    process.exit(0);
  }
}

// Lancer le seed
seed();