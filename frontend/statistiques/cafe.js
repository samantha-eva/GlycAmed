const cafeDaily   = document.getElementById("cafeChartDaily");
const cafeWeekly  = document.getElementById("cafeChartWeekly");
const cafeMonthly = document.getElementById("cafeChartMonthly");
const cafeAnnual  = document.getElementById("cafeChartAnnual");

const cafeColor = '#bc6d5c';

new Chart(cafeDaily, {
  type: 'line',
  data: {
    labels: ['1h','2h','3h','4h','5h','6h','7h','8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '24h'],
    datasets: [{
      label: 'Caféïne (mg)',
      data: [0, 20, 40, 30, 50, 60, 40, 20, 0, 20, 40, 30, 50, 60, 40, 20, 0, 20, 40, 30, 50, 60, 40, 20],
      fill: false,
      borderColor: cafeColor,
      tension: 0.3,
      pointBackgroundColor: cafeColor
    }]
  }
});

new Chart(cafeWeekly, {
  type: 'line',
  data: {
    labels: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
    datasets: [{
      label: 'Caféïne (mg)',
      data: [120,150,180,100,200,50,30],
      fill: false,
      borderColor: cafeColor,
      tension: 0.3,
      pointBackgroundColor: cafeColor
    }]
  }
});

new Chart(cafeMonthly, {
  type: 'line',
  data: {
    labels: ['S1','S2','S3','S4','S5'],
    datasets: [{
      label: 'Caféïne (mg)',
      data: [500,600,550,700,650],
      fill: false,
      borderColor: cafeColor,
      tension: 0.3,
      pointBackgroundColor: cafeColor
    }]
  }
});

new Chart(cafeAnnual, {
  type: 'line',
  data: {
    labels: ['Jan','Fev','Mar','Avr','Mai','Juin','Juil','Aou','Sep','Oct','Nov','Dec'],
    datasets: [{
      label: 'Caféïne (mg)',
      data: [2000,2100,2200,2500,2400,2600,2700,2650,2550,2500,2300,2200],
      fill: false,
      borderColor: cafeColor,
      tension: 0.3,
      pointBackgroundColor: cafeColor
    }]
  }
});

function displayCafe(id) {
  cafeDaily.style.display = "none";
  cafeWeekly.style.display = "none";
  cafeMonthly.style.display = "none";
  cafeAnnual.style.display = "none";

  document.getElementById(id).style.display = "block";
}

displayCafe("cafeChartWeekly");