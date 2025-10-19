var backgroundImageData = [];
//var backgroundImageService = 'pixabay';
var backgroundImageService = 'unsplash';

var timerlength = 300;

document.addEventListener('DOMContentLoaded', function() {
    initialize();
}, false);

function initialize() {

    updateUnsplashBackground();

    setDateTime();

    getWeatherReport();

    getCalendarDetails();

}

function getPixabayBackgroundImageData() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            backgroundImageData = JSON.parse(this.responseText);
            updatePixabayBackground();
        }

        if (this.readyState == 4 && this.status >= 400) {
            reportError("The 'Background Image' query failed to run.", this.status);
        }

    };

    xhttp.open("GET", 'php/get-background-image-data-pixabay.php', true);
    xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
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

            if(!imageUrl){
                setTimeout(updateUnsplashBackground, 3600000);
                return;
            }

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
                setTimeout(updateUnsplashBackground, diff);

                unsplashSync = true;
            }else{
                setTimeout(updateUnsplashBackground, 3600000);
            }

        }

        if (this.readyState == 4 && this.status >= 400) {
            reportError("The 'Background Image' query failed to run.", this.status);
        }

    };

    xhttp.open("GET", 'php/get-background-image-data-unsplash.php?d=' + new Date().getTime(), true);
    xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    xhttp.send();


}

function reportError(txt,code){
    //console.log(txt + ' -- ' + code);

    var errorBox = document.getElementById("error");
    errorBox.style.display = "block";

    var errorBoxMessage = document.getElementById("message");

    errorBoxMessage.innerHTML = txt;

    timercount;
    setInterval(timercount, 1000);
}

function timercount(){

    var time = document.getElementById("countdown");

    timerlength = timerlength - 1;

    if (timerlength <= 0)
    {
        window.location.reload(true);
        return;
    }

    var minutes = Math.floor(timerlength / 60);
    var seconds = timerlength - (minutes * 60);

    if(minutes === 0){minutes = ''}else if(minutes === 1){minutes = minutes + ' minute '}else{minutes = minutes + ' minutes '}
    if(seconds === 0){seconds = ''}else if(seconds === 1){seconds = seconds + ' second '}else{seconds = seconds + ' seconds '}

    time.innerHTML = minutes + seconds;

}


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

function setDateTime(){

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

    function createWeatherForcast(time,icon, pp, st, wd, wdr, ws, wg){

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
        divIconElem.appendChild(imgIconElem);
        imgIconElem.src = "icons/weather/resize/"+icon;
        liElem.appendChild(divIconElem);

        var divTempElem = document.createElement("DIV");
        divTempElem.classList.add("temp");
        divTempElem.innerHTML = Math.round(st)+"&#8451;";
        liElem.appendChild(divTempElem);

        var divPrecipitationElem = document.createElement("DIV");
        divPrecipitationElem.classList.add("precipitation");
        divPrecipitationElem.innerHTML = Math.round(pp)+"%";
        liElem.appendChild(divPrecipitationElem);

        var divWindElem = document.createElement("DIV");
        divWindElem.classList.add("wind");
        divWindElem.innerHTML = '<span style="transform: rotate('+Math.round(wdr)+'deg);" class="windSpeed"></span>' + wd;
        divWindElem.innerHTML += '<br>';
        divWindElem.innerHTML += Math.round(ws) + ' (' + Math.round(wg) + ')';

        liElem.appendChild(divWindElem);
//Wind Direction possible to be Null
        target.appendChild(liElem);
    }

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            target.innerHTML = "";

            var data = JSON.parse(this.responseText);

            for (var i = 0; i < 12; i++) {

                createWeatherForcast(data[i]['time'],data[i]['icon'], data[i]['precipitationRate'], data[i]['screenTemperature'], data[i]['windDirection'], data[i]['windDirectionRaw'], data[i]['windSpeed'], data[i]['gustSpeed']);

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
            reportError("The 'Weather Report' query failed to run.", this.status);
        }

    };

    xhttp.open("GET", 'php/get-open-meteo-report.php?d=' + new Date().getTime(), true);
//    xhttp.open("GET", 'php/get-metoffice-datahub-report.php?d=' + new Date().getTime(), true);
    xhttp.send();
}

var calendarSync = false;
var data = [];
function getCalendarDetails() {

    var targetCalToday = document.getElementById("cal-today");
    var targetCalTomorrow = document.getElementById("cal-tomorrow");
    var targetCalDayafter = document.getElementById("cal-dayafter");
    var targetCalSummary = document.getElementById("cal-summary");

    function similarity(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    function editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
                if (i == 0)
                costs[j] = j;
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                        costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
            costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    function isDuplicate(summary, time){

        var eventElems = document.getElementsByClassName('event');

        for (var i = 0; i < eventElems.length; i++) {

            var eventTime = eventElems[i].getAttribute('data-time');
            var eventSummary = eventElems[i].getAttribute('data-summary')

            if(eventTime === time){

                if(similarity(eventSummary, summary) > 0.8){

                    return true;
                }
            }

        }

        return false;

    }

    function createCalendarItems(targetElemID,summary,eventStart,eventEnd,name){

        function formatToTime(date,target){

            var raw = date.split(" ")[1].split(":");

            if(target === 'cal-summary'){

                var date2 = new Date(date);
                var day = days[date2.getDay()];
                var dateNum = date2.getDate();

                return day + ' ' + dateNum + ordinal(dateNum) + ' | ' + raw[0] + ':' + raw[1];

            }else{
                return raw[0] + ':' + raw[1];
            }
        }

        var stacey = ['Stacey Events'];
        var declan = ['Declan Events','Declan Rota'];

        var nameClass = '';
        if (stacey.indexOf(name) > -1){
            nameClass = 'stacey';
        }else if(declan.indexOf(name) > -1){
            nameClass = 'declan';
        }else{
            nameClass = 'misc';
        }

        var eventElem = document.createElement("DIV");
        eventElem.classList.add("event");
        eventElem.classList.add(nameClass);

        var timeElem = document.createElement("DIV");
        timeElem.classList.add("time");
        if(targetElemID === 'cal-summary'){
            timeElem.innerHTML = formatToTime(eventStart,targetElemID)+" - "+formatToTime(eventEnd,'filler text');
        }else{
            timeElem.innerHTML = formatToTime(eventStart,targetElemID)+" - "+formatToTime(eventEnd,targetElemID);
        }
        var endTemp = new Date(eventEnd);
        var startTemp = new Date(eventStart);
        if((+endTemp - +startTemp) === 86400000){
            timeElem.innerHTML = formatToTime(eventStart,targetElemID).split('|')[0] + ' | All-Day';
        }

        var summaryElem = document.createElement("DIV");
        summaryElem.classList.add("summary");
        summaryElem.innerHTML = summary;

        eventElem.appendChild(timeElem);
        eventElem.appendChild(summaryElem);
        eventElem.setAttribute('data-time', eventStart);
        eventElem.setAttribute('data-summary', summary);
        document.getElementById(targetElemID).appendChild(eventElem);

    }

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            function createHeaders(eventDay,targetID){

                var today = new Date();
                var date = new Date(eventDay);
                var day = days[date.getDay()];
                var dateNum = date.getDate();
                var month = months[date.getMonth()];

                if (date.toDateString() === today.toDateString()) {
                    // today
                    prettyDate = 'Today';
                }else{
                    var prettyDate = day + ' ' + dateNum + ordinal(dateNum);

                }
                /*
                <div class="header">
                    Tue, 29th
                </div>
                */
                var headerElem = document.createElement("DIV");
                headerElem.classList.add("header");
                headerElem.innerHTML = prettyDate;

                document.getElementById(targetID).appendChild(headerElem);
            }

            targetCalToday.innerHTML = "";
            targetCalTomorrow.innerHTML = "";
            targetCalDayafter.innerHTML = "";
            targetCalSummary.innerHTML = "";

            var today = new Date();

            var tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            var dayafter = new Date(today)
            dayafter.setDate(dayafter.getDate() + 2);

            var twoweek = new Date(today)
            twoweek.setDate(twoweek.getDate() + 14);

            createHeaders(today,'cal-today');
            createHeaders(tomorrow,'cal-tomorrow');
            createHeaders(dayafter,'cal-dayafter');

            data = JSON.parse(this.responseText);

            for (var i = 0; i < data.length; i++) {

                /*
                check what day event is send to relevent targetElem
                if more than 3 days check importance

                example output
                {
                    "uid": "20210101_60o30dr268o30c1g60o30dr56k@google.com",
                    "summary": "New Year's Day",
                    "description": "",
                    "dateStart": "2021-01-01 00:00:00",
                    "dateEnd": "2021-01-02 00:00:00",
                    "exdate": [],
                    "recurrence": null,
                    "location": null,
                    "status": "CONFIRMED",
                    "created": "2019-02-21 08:12:31",
                    "updated": "2019-02-21 08:12:31",
                    "importance": "minor",
                    "name": "Public Holidays"
                }
                */

                var startDate = new Date(data[i]['dateStart']);

                var targetElemVar = '';

                if (startDate.toDateString() === today.toDateString()) {
                    // today
                    targetElemVar = 'cal-today';
                } else if (startDate.toDateString() === tomorrow.toDateString()){
                    // tomorrow
                    targetElemVar = 'cal-tomorrow';
                } else if (startDate.toDateString() === dayafter.toDateString()){
                    // day after tomorrow
                    targetElemVar = 'cal-dayafter';
                } else if (startDate < twoweek){
                    // within 2 weeks (but not in first 3 days)
                    targetElemVar = 'cal-summary';
                    if(data[i]['importance'] === 'minor'){
                        continue;
                    }
                }

                if(targetElemVar !== ''){

                    if(isDuplicate(data[i]['summary'],data[i]['dateStart']) === false){

                        createCalendarItems(targetElemVar,data[i]['summary'],data[i]['dateStart'],data[i]['dateEnd'],data[i]['name']);

                    }
                }
            }

            var nextHour = new Date(Math.ceil(new Date().getTime()/3600000)*3600000);
            var now = new Date();
            var diff = nextHour - now;

            if(calendarSync === false){
                setTimeout(getCalendarDetails, diff);

                calendarSync = true;
            }else{
                setTimeout(getCalendarDetails, 3600000);
            }

        }

        if (this.readyState == 4 && this.status >= 400) {
            reportError("The 'Calendar' query failed to run.", this.status);
        }

    };

    xhttp.open("GET", 'php/get-calendar-feeds.php?d=' + new Date().getTime(), true);
    xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    xhttp.send();
}
