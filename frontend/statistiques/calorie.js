const calDaily   = document.getElementById("calorieChartDaily");
const calWeekly  = document.getElementById("calorieChartWeekly");
const calMonthly = document.getElementById("calorieChartMonthly");
const calAnnual  = document.getElementById("calorieChartAnnual");

const calColor = '#6d5cbc';

new Chart(calDaily, {
  type: 'pie',
  data: {
    labels: ['1h','2h','3h','4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '24h'],
    datasets: [{
      data: [300, 600, 500, 200, 100, 300, 600, 500, 200, 100, 300, 600, 500, 200, 100, 300, 600, 500, 200, 100, 300, 600, 500, 200],
      backgroundColor: [calColor, '#9a84ff', '#5a4ab3', '#c8c1ff']
    }]
  }
});

new Chart(calWeekly, {
  type: 'pie',
  data: {
    labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    datasets: [{
      data: [2000,1800,2200,2100,2500,2600,2300],
      backgroundColor: [calColor, '#9a84ff', '#5a4ab3', '#c8c1ff', '#b19dff', '#7d6add', '#d6cdff']
    }]
  }
});

new Chart(calMonthly, {
  type: 'pie',
  data: {
    labels: ['S1','S2','S3','S4','S5'],
    datasets: [{
      data: [9000,9500,8800,9200,9100],
      backgroundColor: [calColor, '#9a84ff', '#5a4ab3', '#c8c1ff', '#b19dff']
    }]
  }
});

new Chart(calAnnual, {
  type: 'pie',
  data: {
    labels: ['Jan','Fev','Mar','Avr','Mai','Juin','Juil','Aou','Sep','Oct','Nov','Dec'],
    datasets: [{
      data: [30000,31000,32000,33000,34000,35000,36000,37000,38000,39000,40000,41000],
      backgroundColor: [
        calColor,'#9a84ff','#5a4ab3','#c8c1ff','#b19dff','#7d6add',
        '#d6cdff','#8673ff','#6d5cbc','#a99aff','#c3b8ff','#8c7bff'
      ]
    }]
  }
});

function displayCalorie(id) {
  calDaily.style.display = "none";
  calWeekly.style.display = "none";
  calMonthly.style.display = "none";
  calAnnual.style.display = "none";

  document.getElementById(id).style.display = "block";
}

displayCalorie("calorieChartWeekly");