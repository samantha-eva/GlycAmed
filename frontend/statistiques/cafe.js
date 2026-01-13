import { CONFIG } from "../config/constants.js";
import { ApiService } from "../service/api.service.js";

const cafeDaily = document.getElementById("cafeChartDaily");
const cafeWeekly = document.getElementById("cafeChartWeekly");
const cafeMonthly = document.getElementById("cafeChartMonthly");
const cafeAnnual = document.getElementById("cafeChartAnnual");

const cafeColor = '#bc6d5c';

let chartInstances = {
  daily: null,
  weekly: null,
  monthly: null,
  annual: null
};

const API_BASE = `${CONFIG.API_URL}/api/consumptions`;


// Utilitaires pour grouper les données
function getTimeOfDay(date) {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'Matin';
  if (hour >= 12 && hour < 18) return 'Après-midi';
  return 'Soir';
}

function getDayName(date) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[date.getDay()];
}

function getWeekOfMonth(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
}

function getMonthName(date) {
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
}

// Fonction pour agréger les données par clé
function aggregateData(data, keyFn) {
  const aggregated = {};
  data.forEach(item => {
    const date = new Date(item.when);
    const key = keyFn(date);
    if (!aggregated[key]) aggregated[key] = 0;
    aggregated[key] += item.caffeine || 0;
  });
  return aggregated;
}

// Fonction pour créer un graphique
function createChart(canvas, labels, data, chartKey) {
  if (chartInstances[chartKey]) {
    chartInstances[chartKey].destroy();
  }
  chartInstances[chartKey] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Caféine (mg)',
        data: data,
        fill: false,
        borderColor: cafeColor,
        tension: 0.3,
        pointBackgroundColor: cafeColor
      }]
    }
  });
}

// Fetch et création des graphiques
async function fetchAndCreateChart(period, canvas, labelsOrder, keyFn, chartKey) {
  try {
    const data = await ApiService.get(`/api/consumptions?period=${period}`);

    const aggregated = aggregateData(data, keyFn);
    
    const chartData = labelsOrder.map(label => aggregated[label] || 0);
    createChart(canvas, labelsOrder, chartData, chartKey);
  } catch (error) {
    console.error(`Erreur lors du chargement des données (${period}):`, error);
  }
}

// Initialisation des graphiques
async function initCharts() {
  // Daily - Matin, Après-midi, Soir
  await fetchAndCreateChart(
    'today',
    cafeDaily,
    ['Matin', 'Après-midi', 'Soir'],
    getTimeOfDay,
    'daily'
  );

  // Weekly - Lundi à Dimanche
  await fetchAndCreateChart(
    'week',
    cafeWeekly,
    ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    getDayName,
    'weekly'
  );

  // Monthly - Semaines 1 à 5
  await fetchAndCreateChart(
    'month',
    cafeMonthly,
    ['S1', 'S2', 'S3', 'S4', 'S5'],
    (date) => `S${getWeekOfMonth(date)}`,
    'monthly'
  );

  // Annual - Jan à Dec
  await fetchAndCreateChart(
    'year',
    cafeAnnual,
    ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
    getMonthName,
    'annual'
  );
}

function displayCafe(id) {
  cafeDaily.style.display = "none";
  cafeWeekly.style.display = "none";
  cafeMonthly.style.display = "none";
  cafeAnnual.style.display = "none";

  document.getElementById(id).style.display = "block";
}

// Initialisation
initCharts();
displayCafe("cafeChartWeekly");

const cafeButtonDaily = document.getElementById("dailyCafe");
const cafeButtonWeekly = document.getElementById("weeklyCafe");
const cafeButtonMonthly = document.getElementById("monthlyCafe");
const cafeButtonAnnual = document.getElementById("annualCafe");

cafeButtonDaily.addEventListener("click", () => {
  displayCafe("cafeChartDaily");
});
cafeButtonWeekly.addEventListener("click", () => {
  displayCafe("cafeChartWeekly");
});
cafeButtonMonthly.addEventListener("click", () => {
  displayCafe("cafeChartMonthly");
});
cafeButtonAnnual.addEventListener("click", () => {
  displayCafe("cafeChartAnnual");
});