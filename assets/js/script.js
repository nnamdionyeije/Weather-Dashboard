var searchForm = document.querySelector.apply("#search-form");
var searchInput = document.querySelector.apply(".search-input");


searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    if (searchInput.value = "") {
        return;
    }

    var cityName = searchInput.value;
})







// function getApi() {
//     var weatherUrl = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}'
// }


// geocoder API
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}


// current weather
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}