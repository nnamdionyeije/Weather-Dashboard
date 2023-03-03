var locationArray = [];
const wrapper = document.querySelectorAll('.history-buttons');
var buttonAction = $('.history-buttons-list');


//bug: If the user types in a city name like "bronx", then the api will make a button called "the bronx"
// however this means that the checker for duplicate buttons won't register it as a duplicate
    
$('#search-form').submit(function(event) {

    event.preventDefault();
    var repeatChecker;

    var cityName = $(".search-input").val();

    if (cityName == "") {
        return;
    } 
    
    $('.history-button').each(function() {
        if ($(this).text().toUpperCase() == cityName.toUpperCase()) {
            repeatChecker = true;
        }
    })

    if (repeatChecker === true) {
        return;
    } else {
        $(".weather-box").children("h2").remove();
        $(".weather-box").children("h3").remove();
        $(".forecast-objects").children("div").remove();

        var currentLocationArray = getGeoCode(cityName);

        $('.search-input').val("");
        
        locationArray = [];
    }
})

async function getGeoCode(stringCity) {

    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + stringCity + '&limit=5&appid=87c01ac00f3c64dda1d5e5131cf3d6a8';
    
    let results = await fetch(requestUrl)
    let data = await results.json();

    if (data.length == 0) {
        $('.search-input').val("");
        return
    } else {
        locationArray.push(data[0].lat);
        locationArray.push(data[0].lon);
        locationArray.push(data[0].name); 
        getCurrentForecast(locationArray[0], locationArray[1]);
        getFiveDayForecast(locationArray[0], locationArray[1]);
        setCityButtons(locationArray);
        //moving this function call back to the event handler
    }
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

function setCityButtons(currLocationArray) {
    var citiesArray = [];

    var newLocationObject = [
        latValue = locationArray[0],
        longValue = locationArray[1],
        cityName = locationArray[2],
    ]

    var holder = JSON.parse(localStorage.getItem("cityObjects"));
    
    if (holder === null) {
        citiesArray.push(newLocationObject);
    } else {
        citiesArray = holder;
        citiesArray.push(newLocationObject);
    }

    if (citiesArray.length > 10) {
        citiesArray.shift();
        $(".history-buttons-list li").first().remove();
    }

    localStorage.setItem("cityObjects", JSON.stringify(citiesArray));
    var newButton =  $("<button>").text(currLocationArray[2]).addClass("history-button");
    var buttonListItem = $("<li>").append(newButton);

    $(".history-buttons-list").append(buttonListItem);   
    
    
}

$('.history-buttons-list').on("click", function(event) {
    event.preventDefault;
    var element = event.target;
    if (element.matches('button')) {
        $(".weather-box").children("h2").remove();
        $(".weather-box").children("h3").remove();
        $(".forecast-objects").children("div").remove();

        //cycle through local storage for the matching object then pull the location data
        var storedCities = JSON.parse(localStorage.getItem("cityObjects"));
        var buttonTextHolder = element.textContent;
        console.log(storedCities[0][2]);

        for (i = 0; i < storedCities.length; i++) {
            var cityHolder = storedCities[i][2];
            
            if (cityHolder.toUpperCase() == buttonTextHolder.toUpperCase()) {
                getCurrentForecast(storedCities[i][0], storedCities[i][1]);
                getFiveDayForecast(storedCities[i][0], storedCities[i][1]);
                return;
            }
        }
        // getGeoCode(element.textContent);
        // $('.search-input').val("");
        // locationArray = [];
    }
})

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cityObjects"));
    for (i = 0; i < storedCities.length; i++) {
        var newButton =  $("<button>").text(storedCities[i][2]).addClass("history-button");
        var buttonListItem = $("<li>").append(newButton);
        $(".history-buttons-list").append(buttonListItem);
    }
}

init();

