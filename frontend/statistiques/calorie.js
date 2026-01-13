import { CONFIG } from "../config/constants.js";
import { ApiService } from "../service/api.service.js";

const calDaily = document.getElementById("calorieChartDaily");
const calWeekly = document.getElementById("calorieChartWeekly");
const calMonthly = document.getElementById("calorieChartMonthly");
const calAnnual = document.getElementById("calorieChartAnnual");

const calColors = {
  daily: ['#6d5cbc', '#9a84ff', '#5a4ab3'],
  weekly: ['#6d5cbc', '#9a84ff', '#5a4ab3', '#c8c1ff', '#b19dff', '#7d6add', '#d6cdff'],
  monthly: ['#6d5cbc', '#9a84ff', '#5a4ab3', '#c8c1ff', '#b19dff'],
  annual: ['#6d5cbc', '#9a84ff', '#5a4ab3', '#c8c1ff', '#b19dff', '#7d6add', '#d6cdff', '#8673ff', '#6d5cbc', '#a99aff', '#c3b8ff', '#8c7bff']
};

const API_BASE = `${CONFIG.API_URL}/api/consumptions`;

let calorieChartInstances = {
  daily: null,
  weekly: null,
  monthly: null,
  annual: null
};

function getCalorieTimeOfDay(date) {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'Matin';
  if (hour >= 12 && hour < 18) return 'Après-midi';
  return 'Soir';
}

function getCalorieDayName(date) {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[date.getDay()];
}

function getCalorieWeekOfMonth(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
}

function getCalorieMonthName(date) {
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
}

// Fonction pour agréger les données par clé
function aggregateCalorieData(data, keyFn) {
  const aggregated = {};
  data.forEach(item => {
    const date = new Date(item.when);
    const key = keyFn(date);
    if (!aggregated[key]) aggregated[key] = 0;
    aggregated[key] += item.calories || 0;
  });
  return aggregated;
}

// Fonction pour créer un graphique pie
function createCalorieChart(canvas, labels, data, colors, chartKey) {
  if (calorieChartInstances[chartKey]) {
    calorieChartInstances[chartKey].destroy();
  }
  calorieChartInstances[chartKey] = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors
      }]
    }
  });
}

// Fetch et création des graphiques avec token JWT
async function fetchAndCreateCalorieChart(period, canvas, labelsOrder, keyFn, colors, chartKey) {
  try {
    
    const data = await ApiService.get(`/api/consumptions?period=${period}`);
        
    const aggregated = aggregateCalorieData(data, keyFn);
    
    const chartData = labelsOrder.map(label => aggregated[label] || 0);
    createCalorieChart(canvas, labelsOrder, chartData, colors, chartKey);
  } catch (error) {
    console.error(`Erreur lors du chargement des données calories (${period}):`, error);
  }
}

// Initialisation des graphiques
async function initCalorieCharts() {
  // Daily - Matin, Après-midi, Soir
  await fetchAndCreateCalorieChart(
    'today',
    calDaily,
    ['Matin', 'Après-midi', 'Soir'],
    getCalorieTimeOfDay,
    calColors.daily,
    'daily'
  );

  // Weekly - Lundi à Dimanche
  await fetchAndCreateCalorieChart(
    'week',
    calWeekly,
    ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    getCalorieDayName,
    calColors.weekly,
    'weekly'
  );

  // Monthly - Semaines 1 à 5
  await fetchAndCreateCalorieChart(
    'month',
    calMonthly,
    ['S1', 'S2', 'S3', 'S4', 'S5'],
    (date) => `S${getCalorieWeekOfMonth(date)}`,
    calColors.monthly,
    'monthly'
  );

  // Annual - Jan à Dec
  await fetchAndCreateCalorieChart(
    'year',
    calAnnual,
    ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
    getCalorieMonthName,
    calColors.annual,
    'annual'
  );
}

function displayCalorie(id) {
  calDaily.style.display = "none";
  calWeekly.style.display = "none";
  calMonthly.style.display = "none";
  calAnnual.style.display = "none";

  document.getElementById(id).style.display = "block";
}

// Initialisation
initCalorieCharts();
displayCalorie("calorieChartWeekly");

const calorieButtonDaily = document.getElementById("dailyCalorie");
const calorieButtonWeekly = document.getElementById("weeklyCalorie");
const calorieButtonMonthly = document.getElementById("monthlyCalorie");
const calorieButtonAnnual = document.getElementById("annualCalorie");

calorieButtonDaily.addEventListener("click", () => {
  displayCalorie("calorieChartDaily");
});
calorieButtonWeekly.addEventListener("click", () => {
  displayCalorie("calorieChartWeekly");
});
calorieButtonMonthly.addEventListener("click", () => {
  displayCalorie("calorieChartMonthly");
});
calorieButtonAnnual.addEventListener("click", () => {
  displayCalorie("calorieChartAnnual");
});