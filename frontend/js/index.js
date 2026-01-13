import { CONFIG } from "../config/constants.js";
import Store from "./store/store.js"; 

// ===== BARRES DE CONSOMMATION =====

async function getTodayConsumption() {
    try {
        const token = Store.getToken();
        
        const response = await fetch(`${CONFIG.API_URL}/api/consumptions?period=today`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("La réponse n'est pas un tableau :", data);
            return;
        }

        const totalSugar = data.reduce((sum, item) => sum + (item.sugar || 0), 0);
        const totalCaffeine = data.reduce((sum, item) => sum + (item.caffeine || 0), 0);
        const totalCalories = data.reduce((sum, item) => sum + (item.calories || 0), 0);

        
        Store.updateTodayStats({
            sugar: totalSugar,
            caffeine: totalCaffeine,
            calories: totalCalories
        });

        // Affichage dans le HTML
        document.getElementById("sugarQuantity").innerHTML = totalSugar;
        document.getElementById("caffeineQuantity").innerHTML = totalCaffeine;
        document.getElementById("calorieQuantity").innerHTML = totalCalories;

        // Barres (pourcentage)
        let sugarWidth = Math.min((totalSugar / CONFIG.SUGAR_LIMIT) * 100, 100);
        let caffeineWidth = Math.min((totalCaffeine / CONFIG.CAFE_LIMIT) * 100, 100);
        let calorieWidth = Math.min((totalCalories / CONFIG.CALORIE_LIMIT) * 100, 100);

        const sugarBar = document.getElementById("sugarBar");
        const caffeineBar = document.getElementById("caffeineBar");
        const calorieBar = document.getElementById("calorieBar");

        sugarBar.style.width = sugarWidth + "%";
        caffeineBar.style.width = caffeineWidth + "%";
        calorieBar.style.width = calorieWidth + "%";

        // Couleurs selon le niveau
        updateBarColor(sugarBar, sugarWidth);
        updateBarColor(caffeineBar, caffeineWidth);
        updateBarColor(calorieBar, calorieWidth);

    } catch (err) {
        console.log(err);
    }
}

function updateBarColor(bar, width) {
    if (width > 66) {
        bar.style.backgroundColor = "var(--danger)";
    } else if (width > 33) {
        bar.style.backgroundColor = "#f7bb42";
    }
}

// ===== GRAPHIQUES DU DASHBOARD =====

const ctx = document.getElementById('myChart');
const pie = document.getElementById('myPieChart');
const line = document.getElementById('myLineChart');

const API_BASE = `${CONFIG.API_URL}/api/consumptions`;

let dashboardChartInstances = {
    bar: null,
    pie: null,
    line: null
};

function getDashboardDayName(date) {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()];
}

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

function createBarChart(canvas, labels, data) {
    if (dashboardChartInstances.bar) dashboardChartInstances.bar.destroy();
    dashboardChartInstances.bar = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Taux de sucre (g)',
                data,
                borderWidth: 1,
                backgroundColor: '#5cbc6d'
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

function createPieChart(canvas, labels, data) {
    if (dashboardChartInstances.pie) dashboardChartInstances.pie.destroy();
    dashboardChartInstances.pie = new Chart(canvas, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label: 'Taux de sucre (g)',
                data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#ecf0f1', '#02a8b3', '#78e08f', '#0752f8'],
                hoverOffset: 4
            }]
        }
    });
}

function createLineChart(canvas, labels, data) {
    if (dashboardChartInstances.line) dashboardChartInstances.line.destroy();
    dashboardChartInstances.line = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Taux de sucre (g)',
                data,
                borderWidth: 1,
                backgroundColor: '#5cbc6d'
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

async function initDashboardCharts() {
    try {
        const token = Store.getToken();
        
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

        const labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const chartData = labels.map(label => aggregated[label] || 0);

        createBarChart(ctx, labels, chartData);
        createPieChart(pie, labels, chartData);
        createLineChart(line, labels, chartData);

    } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
    }
}

// ===== INITIALISATION =====
getTodayConsumption();
initDashboardCharts();