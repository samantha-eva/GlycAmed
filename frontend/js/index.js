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

  //Charts
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