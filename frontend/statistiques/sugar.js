const sugarDaily = document.getElementById("sugarChartDaily");
const sugarWeekly = document.getElementById("sugarChartWeekly");
const sugarMonthly = document.getElementById("sugarChartMonthly");
const sugarAnnual = document.getElementById("sugarChartAnnual");

 new Chart(sugarDaily, {
    type: 'bar',
    data: {
      labels: ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '24h'],
      datasets: [{
        label: 'Taux de sucre (g)',
        data: [5, 10, 8, 9, 7, 6, 5, 4, 3, 2, 1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        borderWidth: 1,
        backgroundColor: '#5cbc6d',
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

  new Chart(sugarWeekly, {
    type: 'bar',
    data: {
      labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      datasets: [{
        label: 'Taux de sucre (g)',
        data: [12, 100, 50, 70, 60, 80, 75],
        borderWidth: 1,
        backgroundColor: '#5cbc6d',
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

  new Chart(sugarMonthly, {
    type: 'bar',
    data: {
      labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4', 'Semaine 5'],
      datasets: [{
        label: 'Taux de sucre (g)',
        data: [1000, 1200, 800, 1000, 900],
        borderWidth: 1,
        backgroundColor: '#5cbc6d',
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

  new Chart(sugarAnnual, {
    type: 'bar',
    data: {
      labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
      datasets: [{
        label: 'Taux de sucre (g)',
        data: [6000, 6200, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700],
        borderWidth: 1,
        backgroundColor: '#5cbc6d',
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })

  function displaySugar(id){
    const chart = document.getElementById(id);
    
    sugarAnnual.style.display = "none";
    sugarMonthly.style.display = "none";
    sugarWeekly.style.display = "none";
    sugarDaily.style.display = "none";
    
    chart.style.display = "block";
  }

  displaySugar("sugarChartWeekly");