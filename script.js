
const praias = [
  { nome: "Armação", direcaoOrla: 140 },
  { nome: "Pântano do Sul", direcaoOrla: 150 },
  { nome: "Praia dos Açores", direcaoOrla: 150 },
  { nome: "Matadeiro", direcaoOrla: 130 },
  { nome: "Pico da Cruz", latitude: -27.6400, longitude: -48.4600, direcaoOrla: 110 },
  { nome: "Rio Tavares", latitude: -27.6580, longitude: -48.4870, direcaoOrla: 115 },
  { nome: "Morro das Pedras", latitude: -27.7000, longitude: -48.4970, direcaoOrla: 125 },
  { nome: "Campeche", direcaoOrla: 120 },
  { nome: "Joaquina", direcaoOrla: 100 },
  { nome: "Mole", direcaoOrla: 110 },
  { nome: "Barra da Lagoa", direcaoOrla: 90 },
  { nome: "Lagoinha do Leste", direcaoOrla: 130 },
  // { nome: "Santinho", direcaoOrla: 70 },
  // { nome: "Ingleses", direcaoOrla: 50 },
  { nome: "Canasvieiras", direcaoOrla: 0 },
  // { nome: "Jurerê", direcaoOrla: 0 },
  // { nome: "Jurerê Internacional", direcaoOrla: 10 },
  { nome: "Daniela", direcaoOrla: 10 },
  // { nome: "Praia Brava", direcaoOrla: 60 },
  // { nome: "Lagoinha", direcaoOrla: 40 },
  // { nome: "Ponta das Canas", direcaoOrla: 30 },
  // { nome: "Cacupé", direcaoOrla: 300 },
  // { nome: "Praia da Galheta", direcaoOrla: 105 },
  // { nome: "Praia do Forte", direcaoOrla: 10 },
];


const apiKey = "0210afa99b01281c4d20921c9be7a8da"; // Sua chave da API

function calcularScoreVento(direcaoVento, direcaoOrla, windSpeed) {
  let score = 0;
  const diferenca = Math.abs(direcaoVento - direcaoOrla);
  if (diferenca >= 135 && diferenca <= 225) {
    score += 3;
  } else if ((diferenca > 45 && diferenca < 135) || (diferenca > 225 && diferenca < 315)) {
    score += 2;
  } else {
    score += 1;
  }
  if (windSpeed <= 4) {
    score += 1;
  } else if (windSpeed > 7) {
    score -= 1;
  }
  return score;
}

async function buscarCondicoes() {
  const container = document.getElementById('beaches-container');
  container.innerHTML = '';

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Florianopolis,br&appid=${apiKey}&units=metric&lang=pt_br`);
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Não foi possível carregar os dados para Florianópolis`);
    }
    const data = await response.json();
    const windSpeed = data.wind.speed;
    const windDirection = data.wind.deg;

    for (const praia of praias) {
      const score = calcularScoreVento(windDirection, praia.direcaoOrla, windSpeed);
      let labelClass = '';
      let labelText = '';

      if (score >= 4) {
        labelClass = 'excelente';
        labelText = 'Excelente - Deu Praia!';
      } else if (score >= 3) {
        labelClass = 'aceitavel';
        labelText = 'Aceitável';
      } else {
        labelClass = 'desfavoravel';
        labelText = 'Desfavorável';
      }

      const card = document.createElement('div');
      card.className = 'beach-card';

      const windArrow = document.createElement('div');
      windArrow.className = 'wind-arrow';
      windArrow.style.transform = `rotate(${windDirection + 180}deg) scale(${1 + windSpeed / 10})`;

      card.innerHTML = `
        <h2>${praia.nome}</h2>
        
        <p>Vento: ${windSpeed * 3.6.toFixed(1)} km/h</p>
       
        <span class="score-label ${labelClass}">${labelText}</span>
      `;

      card.appendChild(windArrow);
      container.appendChild(card);
    }
    // <p>Condições: ${data.weather[0].description} <p>Temperatura: ${data.main.temp}°C</p></p>
  } catch (error) {
    console.error(error);
    const errorMessage = document.createElement('p');
    errorMessage.textContent = `Erro ao carregar dados: ${error.message}`;
    container.appendChild(errorMessage);
  }
}

window.onload = buscarCondicoes;
