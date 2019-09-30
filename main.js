let locationElement = document.querySelector('#currentLocation');
let statusElement = document.querySelector('#status');
let savedLocationElement = document.querySelector('#savedLocation');
let currentLocationIsKnown = false;
let currentLocation;
let savedLocation;

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
function deg2rad(deg) {
return deg * (Math.PI/180)
}

// Check that service workers are supported
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

const setCurrentLocationInit = function setTheCurrentLocationForTheFirstTime() {
    return new Promise(resolve =>{
        console.log('gggg')
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
        savedLocation = JSON.parse(localStorage.savedGPSPosition);
        showSavedPosition(savedLocation);
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
    if(savedLocation){
        showStatusMessage(checkCloseness());
        currentLocation = position;
    }
}

const checkCloseness = function checkHowCloseCurrentPositionIsFromSavedPosition() {
    let distanceInKm = getDistanceFromLatLonInKm(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        savedLocation.coords.latitude, 
        savedLocation.coords.longitude
        );
    let message = 'Still searching...';

    switch (true) {
        case distanceInKm > 1:
            message =  'You are more than 1 KM away';
            break;
        case distanceInKm > 0.75:
            message =  'You are more than 750 meters away';
            break;
        case distanceInKm > 0.5:
            message =  'You are more than 500 meters away';
            break;
        case distanceInKm > 0.25:
            message =  'You are more than 250 meters away';
            break;
        case distanceInKm > 0.1:
            message =  'You are more than 100 meters away';
            break;
        case distanceInKm > 0.05:
            message =  'You are more than 50 meters away';
            break;
        case distanceInKm > 0.04:
            message =  'Dude You are getting close';
            break;        
        case distanceInKm > 0.03:
            message =  'Dude you are doing great';
            break; 
        case distanceInKm > 0.02:
            message =  'Oooooh Snap you should be able to see him';
            break;
        case distanceInKm > 0.02:
            message =  'Dude where\'s your car?';
            break; 
        case distanceInKm > 0.01:
            message =  'Dude 10 meters brah... ';
            break; 
        default:
            message =  'Dude or you are at your car or in space maybe both...';
        }
    return message;
}

function showStatusMessage(message) {
    statusElement.innerHTML = message;
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
