var lat;
var lon;
var searches = [];

var displayWeatherInfo = function(city) {

  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ce52888f70e5c34a7d0254ed0c8cfc79";
  
  // Fetch data in JSON format for today's weather
  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (weatherData) {
        console.log(weatherData);
        lat = weatherData.coord.lat;
        lon = weatherData.coord.lon;

        // Update html/text content for current day
        var dateAndTime = weatherData.name + " " + moment().format("(M/D/YYYY)");
        $("#city-name").html(dateAndTime + "<img src='http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png'>");

        var temperature = "Temperature: " + weatherData.main.temp + "°F";
        $("#temperature").text(temperature);

        var humidity = "Humidity: " + weatherData.main.humidity + "%";
        $("#humidity").text(humidity);

        var windSpeed = "Wind Speed: " + weatherData.wind.speed + " MPH";
        $("#wind-speed").text(windSpeed);

        var apiUrlUv = "http://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&appid=ce52888f70e5c34a7d0254ed0c8cfc79";

        var apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=ce52888f70e5c34a7d0254ed0c8cfc79";

        // Update 5-day forecast text
        fetch(apiUrl2).then(function(response) {
          // request was successful
          if (response.ok) {
            response.json().then(function (forecastData) {
              for (var i = 1; i <= 5; i++) {
                dayId = "#day" + (i);
                $(dayId).find("h3").text(moment.unix(forecastData.daily[i].dt).format("M/D/YYYY"));
                $(dayId).find("img").attr("src", "http://openweathermap.org/img/wn/" + forecastData.daily[i].weather[0].icon + "@2x.png");
                $(dayId).find(".temp").text("Temp: " + forecastData.daily[i].temp.day + " F°");
                $(dayId).find(".humid").text("Humidity: " + forecastData.daily[i].humidity + "%");
              }
            });
          }
        });
        
        // Update UV index content
        fetch(apiUrlUv).then(function(response) {
          if (response.ok) {
            response.json().then(function (uvData) {
              var uvIndex = uvData.value;
                if (uvIndex >= 8) {
                  $("#uv-index").html("UV Index: <span class='bg-danger'>" + uvIndex + "</span>");
                } else if (uvIndex >= 3) {
                  $("#uv-index").html("UV Index: <span class='bg-warning'>" + uvIndex + "</span>");
                } else {
                  $("#uv-index").html("UV Index: <span class='bg-success'>" + uvIndex + "</span>");
                }
            });
          }
        });
      });
    }
  });
};

// Save searches to local storage
var saveSearches = function() {
  localStorage.setItem("searches", JSON.stringify(searches));
};

// Load searches from local storage
var loadSearches = function() {
  searches = JSON.parse(localStorage.getItem("searches"));

  if (!searches) {
    searches = [];
  }

  for (var i = 0; i < searches.length; i++) {
    var searchItem = $("<li>")
      .addClass("list-group-item")
      .text(searches[i]);

    $(".list-group").prepend(searchItem);
  }
};

// If search button is clicked add new list item element with name of searched city
$("#searchBtn").click(function(event) {
  displayWeatherInfo($("#city").val());
  searches.push($("#city").val());
  var searchItem = $("<li>")
    .addClass("list-group-item")
    .text($("#city").val());
  
  $(".list-group").prepend(searchItem);
  saveSearches();
});

$(".list-group").on("click", "li", function () {
  displayWeatherInfo($(this).text())
});

loadSearches();