  //Bar
  getTodayConsumption();

async function getTodayConsumption() {
    try {
        const response = await fetch('http://localhost:3000/api/consumptions?period=today', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("La réponse n'est pas un tableau :", data);
            return;
        }

        // 👉 Calcul des totaux
        const totalSugar = data.reduce((sum, item) => sum + (item.sugar || 0), 0);
        const totalCaffeine = data.reduce((sum, item) => sum + (item.caffeine || 0), 0);
        const totalCalories = data.reduce((sum, item) => sum + (item.calories || 0), 0);

        // 👉 Affichage dans le HTML
        document.getElementById("sugarQuantity").innerHTML = totalSugar;
        document.getElementById("caffeineQuantity").innerHTML = totalCaffeine;
        document.getElementById("calorieQuantity").innerHTML = totalCalories;

        // 👉 Barres (pourcentage)
        let sugarWidth = (totalSugar / 50) * 100;
        let caffeineWidth = (totalCaffeine / 400) * 100;
        let calorieWidth = (totalCalories / 2000) * 100;

        // 👉 On évite les dépassements
        sugarWidth = Math.min(sugarWidth, 100);
        caffeineWidth = Math.min(caffeineWidth, 100);
        calorieWidth = Math.min(calorieWidth, 100);

        // 👉 Application aux barres
        const sugarBar = document.getElementById("sugarBar");
        const caffeineBar = document.getElementById("caffeineBar");
        const calorieBar = document.getElementById("calorieBar");

        sugarBar.style.width = sugarWidth + "%";
        caffeineBar.style.width = caffeineWidth + "%";
        calorieBar.style.width = calorieWidth + "%";
        
        if(sugarWidth > 33 && sugarWidth <= 66){
            sugarBar.style.backgroundColor = "#f7bb42";
        }
        else if(sugarWidth > 66){
            sugarBar.style.backgroundColor = "var(--danger)";
        }

        if(caffeineWidth > 33 && caffeineWidth <= 66){
            caffeineBar.style.backgroundColor = "#f7bb42";
        }
        else if(caffeineWidth > 66){
            caffeineBar.style.backgroundColor = "var(--danger)";
        }

        if(calorieWidth > 33 && calorieWidth <= 66){
          calorieBar.style.backgroundColor = "#f7bb42";
        }
        else if(calorieWidth > 66){
          calorieBar.style.backgroundColor = "var(--danger)";
        }
        

    } catch (err) {
        console.log(err);
    }
}


//charts
 const ctx = document.getElementById('myChart');
const pie = document.getElementById('myPieChart');
const line = document.getElementById('myLineChart');

const API_BASE = 'http://localhost:3000/api/consumptions';

let dashboardChartInstances = {
  bar: null,
  pie: null,
  line: null
};

// Utilitaire pour grouper par jour de la semaine
function getDashboardDayName(date) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[date.getDay()];
}

// Fonction pour agréger les données de sucre par jour
function aggregateDashboardSugar(data) {
  const aggregated = {};
  data.forEach(item => {
    const date = new Date(item.when);
    const day = getDashboardDayName(date);
    if (!aggregated[day]) aggregated[day] = 0;
    aggregated[day] += item.sugar || 0;
  });
  return aggregated;
}

// Créer le graphique en barres
function createBarChart(canvas, labels, data) {
  if (dashboardChartInstances.bar) {
    dashboardChartInstances.bar.destroy();
  }
  dashboardChartInstances.bar = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Taux de sucre (g)',
        data: data,
        borderWidth: 1,
        backgroundColor: '#5cbc6d'
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

// Créer le graphique pie
function createPieChart(canvas, labels, data) {
  if (dashboardChartInstances.pie) {
    dashboardChartInstances.pie.destroy();
  }
  dashboardChartInstances.pie = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Taux de sucre (g)',
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#ecf0f1',
          '#02a8b3',
          '#78e08f',
          '#0752f8'
        ],
        hoverOffset: 4
      }]
    }
  });
}

// Créer le graphique en ligne
function createLineChart(canvas, labels, data) {
  if (dashboardChartInstances.line) {
    dashboardChartInstances.line.destroy();
  }
  dashboardChartInstances.line = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Taux de sucre (g)',
        data: data,
        borderWidth: 1,
        backgroundColor: '#5cbc6d'
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

// Fetch et création des graphiques
async function initDashboardCharts() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}?period=week`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    
    const data = await response.json();
    const aggregated = aggregateDashboardSugar(data);
    
    // Labels dans l'ordre
    const labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const chartData = labels.map(label => aggregated[label] || 0);
    
    // Créer les 3 graphiques avec les mêmes données
    createBarChart(ctx, labels, chartData);
    createPieChart(pie, labels, chartData);
    createLineChart(line, labels, chartData);
    
  } catch (error) {
    console.error('Erreur lors du chargement des données du dashboard:', error);
  }
}

// Initialisation
initDashboardCharts();