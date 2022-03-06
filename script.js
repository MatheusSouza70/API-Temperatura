const api = {
  key: "64ed82577ced7f69cb1687f0ce536131", //KEY obtida no site da openweathermap.org, pode ser criada ao criar uma conta.
  base: "https://api.openweathermap.org/data/2.5/",
  lang: "pt_br",
  units: "metric",
};

//consts criadas para buscar elementos no html com o javascript
const city = document.querySelector(".city");
const date = document.querySelector(".date");
const container_img = document.querySelector(".container-img");
const container_temp = document.querySelector(".container-temp");
const temp_number = document.querySelector(".container-temp div");
const temp_unit = document.querySelector(".container-temp span");
const weather_t = document.querySelector(".weather");
const search_input = document.querySelector(".form-control");
const search_button = document.querySelector(".btn");
const low_high = document.querySelector(".low-high");



window.addEventListener("load", () => {
  //se o navegador tiver uma função para geolocalização)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  } else {
    alert("O seu navegador não suporta geolocalização!");
  }
  function setPosition(position) {
    console.log(position);
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    coordResults(lat, long);
  }
  // exibe mensagem em alerta com número do erro
  function showError(error) {
    alert(`erro: ${error.message}`);
  }
  //Se o usuário estiver com a geolocalização desativada por padrão, o código sempre gerará uma mensagem de alerta ("erro: User denied Geolocation") ao iniciar o site.
});

// busca de coordenadas do usuário
function coordResults(lat, long) {
  fetch(
    `${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`http error: status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      alert(error.message);
    })
    .then((response) => {
      displayResults(response);
    });
}

// busca de resultados ao clicar
search_button.addEventListener("click", function () {
  searchResults(search_input.value);
});

search_input.addEventListener("keypress", enter);
function enter(event) {
  key = event.keyCode;
  if (key === 13) {
    searchResults(search_input.value);
  }
}

//busca do nome da cidade consultada na API

function searchResults(city) {
  fetch(
    `${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`http error: status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      alert(error.message);
    })
    .then((response) => {
      displayResults(response);
    });
}

//busca e mostra o clima da cidade consultada na API, usando Math

function displayResults(weather) {
  console.log(weather);

  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  date.innerText = dateBuilder(now);

  let iconName = weather.weather[0].icon;
  container_img.innerHTML = `<img src="./icons/${iconName}.png">`;

  let temperature = `${Math.round(weather.main.temp)}`;
  temp_number.innerHTML = temperature;
  temp_unit.innerHTML = `°c`;

  weather_tempo = weather.weather[0].description;
  weather_t.innerText = capitalizeFirstLetter(weather_tempo);

  low_high.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(
    weather.main.temp_max
  )}°c`;
}

// Mostra a data atual da consulta (o dia de hoje, no caso)
function dateBuilder(d) {
  let days = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  let months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julio",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  let day = days[d.getDay()]; //getDay: 0-6
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

// Conversão direta de °C para °F ao clicar na temperatura (html)
container_temp.addEventListener("click", changeTemp);
function changeTemp() {
  temp_number_now = temp_number.innerHTML;

  if (temp_unit.innerHTML === "°c") {
    let f = temp_number_now * 1.8 + 32;
    temp_unit.innerHTML = "°f";
    temp_number.innerHTML = Math.round(f);
  } else {
    let c = (temp_number_now - 32) / 1.8;
    temp_unit.innerHTML = "°c";
    temp_number.innerHTML = Math.round(c);
  }
}

//captura a primeira letra que foi inserido no input e passa para UpperCase
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
