let locationElement = document.querySelector('#currentLocation');
let savedLocationElement = document.querySelector('#savedLocation');
let currentLocationIsKnown = false;
let currentLocation;

const setCurrentLocationInit = function setTheCurrentLocationForTheFirstTime() {
    return new Promise(resolve =>{
        navigator.geolocation.getCurrentPosition(location =>{
            currentLocation = location;
            resolve(true);
        }, undefined, {
            enableHighAccuracy: true
        })
    })
}

const init = async function initializeTheApp(){
    await setCurrentLocationInit();
    showCurrentPosition(currentLocation);
    showSavedPosition(JSON.parse(localStorage.savedGPSPosition));
    navigator.geolocation.watchPosition(updateCurrentLocation, undefined, {
        enableHighAccuracy: true
    });
    console.log('appready');

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
