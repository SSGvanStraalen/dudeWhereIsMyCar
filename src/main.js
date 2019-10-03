let locationElement = document.querySelector('#currentLocation');
let statusElement = document.querySelector('#status');
let savedLocationElement = document.querySelector('#savedLocation');
let appElement = document.querySelector('#runningApp');
let questionElement = document.querySelector('#waitOnAccaptingGeoLocation');
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

const setCurrentLocationInit = function setTheCurrentLocationForTheFirstTime() {
    return new Promise(resolve =>{
        navigator.geolocation.getCurrentPosition(location =>{
            currentLocation = location;
            resolve(true);
        }, e =>{console.log(e)}, {
            enableHighAccuracy: true
        })
    })
}
const toggleBlocks = function toggleTheAppElementAndQuestionElementToBeVisible() {
    appElement.classList.toggle('d-none');
    questionElement.classList.toggle('d-none');
}
const init = async function initializeTheApp(){
    await setCurrentLocationInit();
    if(currentLocation){
        toggleBlocks();
        showCurrentPosition(currentLocation);
    }
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
    savedLocation = saveLocation;
    localStorage.savedGPSPosition = JSON.stringify(saveLocation);
    showSavedPosition(saveLocation);
    showStatusMessage(checkCloseness());
};

const updateCurrentLocation = async function updateCurrentLocationTroughWatch(position) {
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