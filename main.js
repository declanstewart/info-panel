var backgroundImageData = [];
//var backgroundImageService = 'pixabay';
var backgroundImageService = 'unsplash';

document.addEventListener('DOMContentLoaded', function() {
    initialize();
}, false);

function initialize() {

    if(backgroundImageService === "pixabay"){
        getPixabayBackgroundImageData();
        updateBackgroundInterval = setInterval(updatePixabayBackground, 3600000);
    }else{
        updateBackgroundInterval = setInterval(updateUnsplashBackground, 3600000);
        updateUnsplashBackground();
    }

    setDateTime();


}

function getPixabayBackgroundImageData() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            backgroundImageData = JSON.parse(this.responseText);
            updatePixabayBackground();
        }

        if (this.readyState == 4 && this.status >= 400) {
            reportError("getBackgroundImageData", this.status);
        }

    };

    xhttp.open("GET", 'php/get-background-image-data-pixabay.php', true);
    xhttp.send();

}

function updatePixabayBackground() {
    if (backgroundImageData.hits.length === 0){//don't run if no images are found
      return;
    }

    function random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var imageUrl = backgroundImageData.hits[random(1, 200)].largeImageURL;

    let bgElement = document.querySelector(".background");
    bgElement.classList.add("bg-loading");
    let preloaderImg = document.createElement("img");
    preloaderImg.src = imageUrl;

    preloaderImg.addEventListener('load', (event) => {
      bgElement.classList.remove("bg-loading");
      bgElement.style.backgroundImage = `url(${imageUrl})`;
      preloaderImg = null;
    });
}

function updateUnsplashBackground() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            var imageUrlRaw = JSON.parse(this.responseText);
            var imageUrl = imageUrlRaw['urls']['regular'];

            let bgElement = document.querySelector(".background");
            bgElement.classList.add("bg-loading");
            let preloaderImg = document.createElement("img");
            preloaderImg.src = imageUrl;

            preloaderImg.addEventListener('load', (event) => {
              bgElement.classList.remove("bg-loading");
              bgElement.style.backgroundImage = `url(${imageUrl})`;
              preloaderImg = null;
            });
        }

        if (this.readyState == 4 && this.status >= 400) {
            reportError("getBackgroundImageData", this.status);
        }

    };

    xhttp.open("GET", 'php/get-background-image-data-unsplash.php', true);
    xhttp.send();


}

function reportError(txt,code){
    console.log(txt + ' -- ' + code);
}

function setDateTime(){

    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    function ordinal(d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    }

    var timeHourElem = document.getElementById("timeHour");
    var timeMinuteElem = document.getElementById("timeMinute");
    var dateElem = document.getElementById("date");

    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    var day = days[date.getDay()];
    var dateNum = date.getDate();
    var month = months[date.getMonth()];

    var prettyDate = day + ' ' + dateNum + ordinal(dateNum) + ', ' + month;

    timeHourElem.innerHTML = h;
    timeMinuteElem.innerHTML = m;
    dateElem.innerHTML = prettyDate;

    setTimeout(setDateTime, 1000);

}
