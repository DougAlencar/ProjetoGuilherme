const apiKey = '7a8ca7439307e071e3f6181f7cfe3fa9';
let currentWeather = null;

async function getWeather() {
  const tela = document.getElementById('tela');
  tela.innerHTML = "Obtendo localização...";

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro: ${response.status} - ${response.statusText}`);

      const data = await response.json();
      const temp = data.main.temp;
      const description = data.weather[0].description;
      const city = data.name;
      const icon = data.weather[0].icon;

      currentWeather = { temp, description, city, icon };

      tela.innerHTML = `
        <p>Temperatura em ${city}: ${temp}°C</p>
        <p>${description}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Ícone do clima" class="icone-clima">
      `;
    } catch (error) {
      tela.innerHTML = "Não foi possível carregar a previsão do tempo.";
    }
  }, () => {
    tela.innerHTML = "Permissão de localização negada.";
  });
}

const solarPanelModels = [
  "Modelo A - 250W",
  "Modelo B - 300W",
  "Modelo C - 350W",
  "Modelo D - 400W"
];

const addedModels = [];

function openSolarPanelForm() {
  const tela = document.getElementById('tela');
  
  tela.innerHTML = `
    <h3>Adicionar Placa Solar</h3>
    <div class="input-area">
      <select id="solarModelSelect">
        ${solarPanelModels.map(model => `<option value="${model}">${model}</option>`).join('')}
      </select>
      <button onclick="addSolarPanelModel()">Adicionar</button>
    </div>
    <ul id="solarPanelList">${getSolarPanelList()}</ul>
  `;
}

function getSolarPanelList() {
  return addedModels.map((model, index) => `
    <li>
      ${model} 
      <span class="remove-button" onclick="removeSolarPanelModel(${index})">Remover</span>
    </li>`).join('');
}

function addSolarPanelModel() {
  const select = document.getElementById('solarModelSelect');
  const model = select.value;

  if (model) {
    addedModels.push(model);
    openSolarPanelForm();
  }
}

function removeSolarPanelModel(index) {
  addedModels.splice(index, 1); 
  openSolarPanelForm(); 
}

function giveUsageTips() {
  const tela = document.getElementById('tela');
  
  if (!currentWeather) {
    tela.innerHTML = "Primeiro, obtenha a previsão do tempo.";
    return;
  }

  const { description } = currentWeather;
  let tips = "";

  const lowerDescription = description.toLowerCase();

  if (addedModels.length === 0) {
    tips = "Adicione placas solares para calcular a produção de energia.";
  } else {
    const totalWatts = addedModels.reduce((total, model) => {
      const watts = parseInt(model.match(/\d+/)[0]);
      return total + watts;
    }, 0);

    let generatedPower = totalWatts;

    if (lowerDescription.includes("sol") || lowerDescription.includes("céu limpo")) {
      tips = `Ótimo dia para carregar! As placas solares podem gerar até ${generatedPower}W.`;
    } else if (lowerDescription.includes("chuva")) {
      generatedPower *= 0.3; 
      tips = `Cuidado! Em dia de chuva, as placas solares podem gerar apenas ${Math.round(generatedPower)}W.`;
    } else if (lowerDescription.includes("neblina")) {
      generatedPower *= 0.5; 
      tips = `Cuidado com a neblina. As placas podem gerar até ${Math.round(generatedPower)}W.`;
    } else if (lowerDescription.includes("nublado") || lowerDescription.includes("nuvens dispersas")) {
      generatedPower *= 0.4; 
      tips = `Dia nublado, a geração de energia pode ser de ${Math.round(generatedPower)}W.`;
    } else {
      tips = "Condições climáticas não identificadas. Verifique as placas regularmente.";
    }
  }

  tela.innerHTML = `<h3>Dicas de Uso</h3><p>${tips}</p>`;
}

function openContactForm() {
  const tela = document.getElementById('tela');
  tela.innerHTML = `
    <h3>Fale com a Gente</h3>
    <form action="https://formspree.io/f/xqakppwn" method="POST">
      <div class="input-area">
        <input type="text" id="userName" name="name" placeholder="Seu Nome" required>
        <textarea id="userMessage" name="message" placeholder="Sua Mensagem" required></textarea>
        <button type="submit">Enviar</button>
      </div>
    </form>
  `;
}
