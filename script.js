let allCitiesMain = [];

$("#new-city").on("click", function(event) {
  event.preventDefault();

  let city = $("#city-input").val();
  apiCall(city);
});

$("#all-city").on("click", ".city", function(event) {
  event.preventDefault();

  let city = $(this).text();
  apiCall(city);
});

$("#remove-city").on("click", function() {
allCitiesMain = [];
  saveCities();
  renderCities();
})

function apiCall(city) {
  const APIKey = "3a75c927df0aeb8aeb620318ce5434c7";
  let fiveDayForecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},us&units=imperial&appid=${APIKey}`;
  let mainDailyURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&appid=${APIKey}`;

  $.ajax({
      url: fiveDayForecastURL,
      method: "GET"
  }).then(function(response) {
        fiveDayForecast(response);
  })

  $.ajax({
      url: mainDailyURL,
      method: "GET"
  }).then(function(response) {
    showForecast(response);
  })

  if (allCitiesMain.indexOf(city) === -1) {
    allCitiesMain.push(city);
  }

  saveCities();
  renderCities();
};

function init() {
  let storedCityInfo = JSON.parse(localStorage.getItem("allCitiesMain"));
  if (storedCityInfo !== null) {
    allCitiesMain = storedCityInfo;
  }
}

function saveCities() {
  localStorage.setItem("allCitiesMain", JSON.stringify(allCitiesMain));
}

function showForecast(response) {
  let cityName = response.name;
  let cityDate = moment().format('l');
  let cityIcon = response.weather[0].icon;
  let cityTemp = Math.round(response.main.temp);
  let cityHumid = response.main.humidity;
  let cityWind = Math.round(response.wind.speed);
  let cityCondition = response.weather[0].main;
  let cityIconEl = $("<img>").attr("src", `https://openweathermap.org/img/w/${cityIcon}.png`)
  $("#city-name").text(cityName + ' (' + cityDate + ')').append(cityIconEl);
  $("#city-temp").text(cityTemp);
  $("#city-humid").text(cityHumid);
  $("#city-wind").text(cityWind);
  $("#city-condition").text(cityCondition);
}

function fiveDayForecast(response) {

  $("#five-day-deck").empty();
  for (let i = 6; i < 40; i += 8) {
    let cardDate = response.list[i].dt_txt;
    let date = new Date(cardDate).toLocaleDateString('en-US', {
      day : 'numeric',
      month : 'numeric',
      year : 'numeric'
    });
    let cardTemp = Math.round(response.list[i].main.temp);
    let cardHumid = Math.round(response.list[i].main.humidity);
    let iconSource = response.list[i].weather[0].icon;

    let cardEl = $("<div>").attr("class", "card");
    let cardBodyEl = $("<div>").attr("class", "card-body five-card");
    let cardTitleEl = $("<h6>").attr("class", "card-title").text(date);
    let cardIcon = $("<img>").attr("src", `https://openweathermap.org/img/w/${iconSource}.png`);
    let cardTempEl = $("<p>").attr("class", "card-text").text(`Temp: ${cardTemp} °F`);
    let cardHumidEl = $("<p>").attr("class", "card-text").text(`Humidity: ${cardHumid}%`);
    cardEl.append(cardBodyEl);
    cardBodyEl.append(cardTitleEl).append(cardIcon).append(cardTempEl).append(cardHumidEl);
    $("#five-day-deck").append(cardEl);
  }
}

function renderCities() {
  $("#all-city").empty();


  allCitiesMain.forEach(city => {

    let cityCard = $("<div>").attr("class", "card");
    let cityCardBody = $("<div>").attr("class", "card-body city").text(city);
    cityCard.append(cityCardBody);
    $("#all-city").prepend(cityCard);
  })
}

init();