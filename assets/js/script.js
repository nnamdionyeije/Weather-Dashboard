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
    var windLine = $("<h3>").text("Wind: " + data.wind.speed + "MPH");
    var humidLine = $("<h3>").text("Humidity: " + data.main.humidity + " %");

    $(".weather-box").append(cityTimeLine, tempLine, windLine, humidLine);
}

function getFiveDayForecast(latitude, longitude) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=87c01ac00f3c64dda1d5e5131cf3d6a8';    
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
    
}



// function getApi() {
//     var weatherUrl = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}'
// }


// geocoder API
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}


// current weather
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}