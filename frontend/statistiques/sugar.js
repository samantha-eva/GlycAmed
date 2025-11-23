const sugarDaily = document.getElementById("sugarChartDaily");
const sugarWeekly = document.getElementById("sugarChartWeekly");
const sugarMonthly = document.getElementById("sugarChartMonthly");
const sugarAnnual = document.getElementById("sugarChartAnnual");

const sugarColor = '#5cbc6d';
const API_BASE = 'http://localhost:3000/api/consumptions';

let sugarChartInstances = {
  daily: null,
  weekly: null,
  monthly: null,
  annual: null
};

// Utilitaires pour grouper les données
function getTimeOfDay(date) {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'Matin';
  if (hour >= 12 && hour < 18) return 'Après-midi';
  return 'Soir';
}

function getSugarDayName(date) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[date.getDay()];
}

function getSugarWeekOfMonth(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
}

function getSugarMonthName(date) {
  const months = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
  return months[date.getMonth()];
}

// Fonction pour agréger les données par clé
function aggregateSugarData(data, keyFn) {
  const aggregated = {};
  data.forEach(item => {
    const date = new Date(item.when);
    const key = keyFn(date);
    if (!aggregated[key]) aggregated[key] = 0;
    aggregated[key] += item.sugar || 0;
  });
  return aggregated;
}

// Fonction pour créer un graphique
function createSugarChart(canvas, labels, data, chartKey) {
  if (sugarChartInstances[chartKey]) {
    sugarChartInstances[chartKey].destroy();
  }
  sugarChartInstances[chartKey] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Taux de sucre (g)',
        data: data,
        borderWidth: 1,
        backgroundColor: sugarColor
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Fetch et création des graphiques avec token JWT
async function fetchAndCreateSugarChart(period, canvas, labelsOrder, keyFn, chartKey) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}?period=${period}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    
    const data = await response.json();
    const aggregated = aggregateSugarData(data, keyFn);
    
    const chartData = labelsOrder.map(label => aggregated[label] || 0);
    createSugarChart(canvas, labelsOrder, chartData, chartKey);
  } catch (error) {
    console.error(`Erreur lors du chargement des données sucre (${period}):`, error);
  }
}

// Initialisation des graphiques
async function initSugarCharts() {
  // Daily - Matin, Après-midi, Soir
  await fetchAndCreateSugarChart(
    'today',
    sugarDaily,
    ['Matin', 'Après-midi', 'Soir'],
    getTimeOfDay,
    'daily'
  );

  // Weekly - Lundi à Dimanche
  await fetchAndCreateSugarChart(
    'week',
    sugarWeekly,
    ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    getSugarDayName,
    'weekly'
  );

  // Monthly - Semaines 1 à 5
  await fetchAndCreateSugarChart(
    'month',
    sugarMonthly,
    ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4', 'Semaine 5'],
    (date) => `Semaine ${getSugarWeekOfMonth(date)}`,
    'monthly'
  );

  // Annual - Janvier à Décembre
  await fetchAndCreateSugarChart(
    'year',
    sugarAnnual,
    ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
    getSugarMonthName,
    'annual'
  );
}

function displaySugar(id) {
  sugarDaily.style.display = "none";
  sugarWeekly.style.display = "none";
  sugarMonthly.style.display = "none";
  sugarAnnual.style.display = "none";

  document.getElementById(id).style.display = "block";
}

// Initialisation
initSugarCharts();
displaySugar("sugarChartWeekly");