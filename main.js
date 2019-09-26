let locationElement = document.querySelector('#currentLocation');
let savedLocationElement = document.querySelector('#savedLocation');
let currentLocationIsKnown = false;
let currentLocation;

// Check that service workers are supported
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

const setCurrentLocationInit = function setTheCurrentLocationForTheFirstTime() {
    return new Promise(resolve =>{
        navigator.geolocation.getCurrentPosition(location =>{
            console.log('kom ik hier?')
            currentLocation = location;
            resolve(true);
        }, e =>{console.log(e)}, {
            enableHighAccuracy: true
        })
    })
}

const init = async function initializeTheApp(){
    console.log('init ')
    await setCurrentLocationInit();
    showCurrentPosition(currentLocation);
    if(localStorage.savedGPSPosition){
        showSavedPosition(JSON.parse(localStorage.savedGPSPosition));
    }
    navigator.geolocation.watchPosition(updateCurrentLocation, undefined, {
        enableHighAccuracy: true
    });
}

const saveLocation = async function saveCurrentGPSLocationToLocalStorage(){
    let saveLocation = {
        coords: {
            latitude : currentLocation.coords.latitude,
            longitude : currentLocation.coords.longitude
        }
    }
    localStorage.savedGPSPosition = JSON.stringify(saveLocation);
    showSavedPosition(saveLocation);
};

const updateCurrentLocation = async function updateCurrentLocationTroughWatch(position) {
    console.log('update!');
    showCurrentPosition(position);
    currentLocation = position;
}

function showCurrentPosition(position) {
    locationElement.innerHTML = "Latitude: " + position.coords.latitude + 
    " Longitude: " + position.coords.longitude;
}

function showSavedPosition(position) {
    savedLocationElement.innerHTML = "Latitude: " + position.coords.latitude + 
    " Longitude: " + position.coords.longitude;
}
 
document.onload = init();
