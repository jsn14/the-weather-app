import {
    Copyright,
    Location,
    ApiCall
} from "./modules/classes";

// API URL parameters
const api = 'https://api.openweathermap.org/data/2.5/weather?';
const apiKey = '&APPID=301928bddd4ba25acb86c57cdcd71281';
const units = "metric"; // api parameter for units

// select DOM element for status message
const mode_message = document.querySelector('#message');
const mode_icon = document.querySelector('#mode_icon');

// get user input
const UIButton = document.getElementById("submit");
const userInput = document.getElementById("city-entered");
const refreshBtn = document.getElementById('refresh-btn');



// get user input on button click
UIButton.addEventListener("click", () => {
    manual_location();
});

// get user input when enter key pressed
userInput.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
        manual_location();
    }
});

refreshBtn.addEventListener('click', () => {
    window.location.reload();
});

//update copyright year
new Copyright();

// detect location fucntion call
detectLocation();

//function to detect geoloaction
function detectLocation() {
    //call Location class for geolocation
    new Location().then((position) => {
            console.log('Location detected');
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            if (lat !== null && lon !== null) {
                const coords = 'lat=' + lat + '&lon=' + lon;
                checkWeather(coords);
                mode_message.textContent = 'Auto-location';
                mode_icon.src = 'dist/img/location-arrow.svg';
            };
        })
        .catch((error) => {
            console.log(error.message);
            mode_message.textContent = error.message;
        });
}

// function to get manual user input and validate
function manual_location(){
    const city_entered = userInput.value;
        if (city_entered) {
            let location = "q=" + city_entered;
            checkWeather(location);
            mode_message.textContent = 'Manual Input';
            mode_icon.src = 'dist/img/kb.svg';
        } else {
            alert('invalid user input');
        }
}

// api call and DOM element updates based on api response
function checkWeather(location) {
    //compose api URL
    const apiURL = `${api}${location}&units=${units}${apiKey}`;

    // api call
    new ApiCall(apiURL).then((weatherData) => {
        // set object to collect required weather data from API Promise
        const currentWeather = {
            city: weatherData.name,
            country: weatherData.sys.country,
            icon: weatherData.weather[0].icon,
            temperatue: weatherData.main.temp,
            conditions: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            visibility: weatherData.visibility,
            pressure: weatherData.main.pressure
        }

        // set variables to select DOM elements
        const city = document.querySelector('#city');
        const temp = document.querySelector('#temp');
        const icon = document.querySelector('#icon');
        const conditions = document.querySelector('#current-condition');
        const humidity = document.querySelector('#humidity');
        const visibility = document.querySelector('#visibility');
        const pressure = document.querySelector('#pressure');

        // push changes to selected DOM elements
        city.textContent = currentWeather.city + ', ' + currentWeather.country;
        icon.src = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
        temp.innerHTML = Math.round(currentWeather.temperatue);
        conditions.textContent = currentWeather.conditions;
        humidity.textContent = currentWeather.humidity;
        visibility.textContent = (currentWeather.visibility) / 1000;
        pressure.textContent = (currentWeather.pressure) / 10;
        console.log('Weather UI updated');
    });
}
