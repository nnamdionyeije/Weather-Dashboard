var locationArray = [];
//after the call I will have to set these back to empty arrays
    
$('#search-form').submit(function(event) {
    event.preventDefault();
    if ($('.search-input').val() == "") {
        return;
    } else {
        var cityName = $(".search-input").val();
        var locationObject = getGeoCode(cityName);
        if (locationArray.length == 0) {
            return;
        } else {
            getCurrentForecast(locationArray[0], locationArray[1]);
            getFiveDayForecast(locationArray[0], locationArray[1]);
            var newButton =  $("<button>").text(locationArray[2]);
            var buttonListItem = $("<li>").append(newButton);
            $(".history-buttons").append(buttonListItem);
            console.log(locationArray[2]);
        }
    }

    
})


function getGeoCode(stringCity) {
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + stringCity + '&limit=5&appid=87c01ac00f3c64dda1d5e5131cf3d6a8';
    var location = [];
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length == 0) {
                return
            }
            locationArray.push(data[0].lat);
            locationArray.push(data[0].lon);
            locationArray.push(data[0].name);
        });    
}

function getCurrentForecast(latitude, longitude) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=87c01ac00f3c64dda1d5e5131cf3d6a8&units=imperial';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setCurrentForecast(data);
        });
}

function setCurrentForecast(data) {
    var cityTime = data.name + ' ' + dayjs.unix(data.dt).format('(MMMM, DD YYYY)');
    var weatherImage = $("<img>").attr("src", 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png');
    var cityTimeLine = $("<h2>").text(cityTime).append(weatherImage);

    var tempLine = $("<h3>").text("Temp: " + data.main.temp + " \u2109");
    var windLine = $("<h3>").text("Wind: " + data.wind.speed + " MPH");
    var humidLine = $("<h3>").text("Humidity: " + data.main.humidity + " %");

    $(".weather-box").append(cityTimeLine, tempLine, windLine, humidLine);
}

function getFiveDayForecast(latitude, longitude) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=87c01ac00f3c64dda1d5e5131cf3d6a8&units=imperial';    
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.list[0]);
            setFiveDayForecast(data);
        })
}

function setFiveDayForecast(data) {
    for (i = 1; i < 6; i++) {
        var currentindex = (i * 8) - 1;
        var dayContainer = $("<div>").addClass("forecast-container");
        var nextDataText = dayjs.unix(data.list[currentindex].dt).format('(MMMM, DD YYYY)');
        var nextData = $("<h2>").text(nextDataText);

        var forecastImage = $("<img>").attr("src", 'http://openweathermap.org/img/wn/' + data.list[currentindex].weather[0].icon + '.png');

        var tempLineForecast = $("<h3>").text("Temp: " + data.list[currentindex].main.temp + " \u2109");
        var windLineForecast = $("<h3>").text("Wind: " + data.list[currentindex].wind.speed + " MPH");
        var humidLineForecast = $("<h3>").text("Humidity: " + data.list[currentindex].main.humidity + " %");

        dayContainer.append(nextData, forecastImage, tempLineForecast, windLineForecast, humidLineForecast);
        $(".forecast-objects").append(dayContainer);
    } 
}

// function addCityButton()