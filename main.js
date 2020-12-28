var backgroundImageData = [];
//var backgroundImageService = 'pixabay';
var backgroundImageService = 'unsplash';

document.addEventListener('DOMContentLoaded', function() {
    initialize();
}, false);

function initialize() {

    updateUnsplashBackground();

    setDateTime();

    getWeatherReport();

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

var unsplashSync = false;
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

            var nextHour = new Date(Math.ceil(new Date().getTime()/3600000)*3600000);
            var now = new Date();
            var diff = nextHour - now;

            if(unsplashSync === false){
                setTimeout(getWeatherReport, diff);

                unsplashSync = true;
            }else{
                setTimeout(getWeatherReport, 3600000);
            }

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

var weatherSync = false;
function getWeatherReport() {

    var target = document.getElementById("weather");

    function createWeatherForcast(time,swc, pp, st){

        timeraw = time.split(" ")[1].split(":");
        timeOutput = timeraw[0]+':'+timeraw[1];

        var liElem = document.createElement("LI");
        liElem.classList.add("forcast");

        var divTimeElem = document.createElement("DIV");
        divTimeElem.classList.add("time");
        divTimeElem.innerHTML = timeOutput;
        liElem.appendChild(divTimeElem);

        var divIconElem = document.createElement("DIV");
        divIconElem.classList.add("icon");

        var imgIconElem = document.createElement("IMG");
        imgIconElem.src = "icons/weather/resize/"+swc+".svg";
        divIconElem.appendChild(imgIconElem);
        liElem.appendChild(divIconElem);

        var divPrecipitationElem = document.createElement("DIV");
        divPrecipitationElem.classList.add("precipitation");
        divPrecipitationElem.innerHTML = Math.round(pp)+"%";
        liElem.appendChild(divPrecipitationElem);

        var divTempElem = document.createElement("DIV");
        divTempElem.classList.add("temp");
        divTempElem.innerHTML = Math.round(st)+"&deg;";
        liElem.appendChild(divTempElem);

        target.appendChild(liElem);
    }

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            target.innerHTML = "";

            var data = JSON.parse(this.responseText);

            for (var i = 0; i < 12; i++) {

                createWeatherForcast(data[i]['time'],data[i]['significantWeatherCode'], data[i]['precipitationRate'], data[i]['screenTemperature']);

            }

            var nextFifteen = new Date(Math.ceil(new Date().getTime()/900000)*900000);
            var now = new Date();
            var diff = nextFifteen - now;

            if(weatherSync === false){
                setTimeout(getWeatherReport, diff);

                weatherSync = true;
            }else{
                setTimeout(getWeatherReport, 900000);
            }

        }

        if (this.readyState == 4 && this.status >= 400) {
            reportError("getWeatherReport", this.status);
        }

    };

    xhttp.open("GET", 'php/get-metoffice-datahub-report.php', true);
    xhttp.send();
}
