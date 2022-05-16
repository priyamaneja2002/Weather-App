// api key : 57a64611d925e296aedd06747cb08d2d

const iconElement = document.querySelector(".weatherIcon");
const tempElement = document.querySelector(".tempValue p");
const descElement = document.querySelector(".tempDescription p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

//App data
const weather = {};

weather.temperature = {
    unit : "celsius"
} 

//App consts and vars
const KELVIN = 273;
//API key
const key = "eab1f137ae6544eabd0caad228054076";

//Check if browser supports geolocation
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser Doesn't Support Geolocation</p>";
}

//Set user's position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

//Show error when there is an issue with geolocation service
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message}</p>`;

}

// Get weather from API
function getWeather(latitude,longitude){
    let res = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`)
    .then(res => {
        weather.temperature.value = Math.floor(res.data.main.temp - KELVIN);
        weather.description = res.data.weather[0].description;
        weather.iconId = res.data.weather[0].icon;
        weather.city = res.data.name;
        weather.country = res.data.sys.country;
    })
    .then( ()=>{
        displayWeather();
    })
};

//Display weather to UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `<p>${weather.temperature.value} °<span>C</span></p>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) +32 ;
}

tempElement.addEventListener("click",()=>{
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `<p>${fahrenheit} °<span>F</span></p>`;
        weather.temperature.unit = "fahrenheit";

    }
    else{
        tempElement.innerHTML = `<p>${weather.temperature.value} °<span>C</span></p>`;
        weather.temperature.unit = "celsius";

    }
});