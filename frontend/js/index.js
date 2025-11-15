  const ctx = document.getElementById('myChart');
  const pie = document.getElementById('myPieChart');
  const line = document.getElementById('myLineChart');

  new Chart(ctx, {
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

  new Chart(pie, {
  type: 'pie',
  data: {
      labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      datasets: [{
      label: 'Taux de sucre (g)',
      data: [12, 100, 50, 70, 60, 80, 75],
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

  new Chart(line, {
    type: 'line',
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
  })