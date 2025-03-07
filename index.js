
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab=userTab;
const API_KEY="3747886919928ba9be8ac857ac5997bb";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        newTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // make your weather tab visible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // display weather, so check local storage first for coordinates, if we have saved them there
            getfromSessionStorage();
        }

    }
}

userTab.addEventListener('click', ()=>{
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click', ()=>{
    // pass clicked tab as input parameter
    switchTab(searchTab);
});

// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // local coordinates not saved
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}= coordinates;
    // make grant access container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try{
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json(); 

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        // HW
    }
}

function renderWeatherInfo(weatherInfo){
    // fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDsc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temperature]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo and put in UI elements
    cityName.innerText= weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText= `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // HW - show and alert for no geolocation support available
    }
}

function showPosition(position){

    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);


const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName===""){
        return;
    }
    else
    {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(cityName){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json(); 

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){

    }
}