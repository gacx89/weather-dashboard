var displayWeatherInfo = function() {
  var city = $("#city").val();
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ce52888f70e5c34a7d0254ed0c8cfc79";
  console.log(city);

  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (weatherData) {
        console.log(weatherData);

        var dateAndTime = weatherData.name + " " + moment().format("(M/D/YYYY)");
        $("#city-name").text(dateAndTime);

        var temperature = "Temperature: " + weatherData.main.temp + "°F";
        $("#temperature").text(temperature);

        var humidity = "Humidity: " + weatherData.main.humidity + "%";
        $("#humidity").text(humidity);

        var windSpeed = "Wind Speed: " + weatherData.wind.speed + " MPH";
        $("#wind-speed").text(windSpeed);

        var apiUrlUv = "http://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&appid=ce52888f70e5c34a7d0254ed0c8cfc79";

        fetch(apiUrlUv).then(function (response) {
          if (response.ok) {
            response.json().then(function (uvData) {
              console.log(uvData);
              var uvIndex = "UV Index: " + uvData.value;
              console.log(uvIndex);
              $("#uv-index").text(uvIndex);
            });
          }
        });
      });
    }
  });
  

 
};


