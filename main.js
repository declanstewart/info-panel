var backgroundImageData = [];

//var backgroundImageService = 'pixabay';
var backgroundImageService = 'unsplash';

document.addEventListener('DOMContentLoaded', function() {
    initialize();
}, false);

function initialize() {

    if(backgroundImageService === "pixabay"){
        getPixabayBackgroundImageData();
        updateBackgroundInterval = setInterval(updatePixabayBackground, 300000);
    }else{
        updateBackgroundInterval = setInterval(updateUnsplashBackground, 300000);
        updateUnsplashBackground();
    }


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

    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();


}
