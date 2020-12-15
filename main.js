var backgroundImageData = [];


document.addEventListener('DOMContentLoaded', function() {
    initialize();
}, false);

function initialize() {

  getBackgroundImageData();
  updateBackgroundInterval = setInterval(updateBackground, 300000);

}

function getBackgroundImageData() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            backgroundImageData = JSON.parse(this.responseText);
            updateBackground();
        }

        if (this.readyState == 4 && this.status >= 400) {
            reportError("getBackgroundImageData", this.status);
        }

    };

    xhttp.open("GET", 'php/get-background-image-data.php', true);
    xhttp.send();

}

function updateBackground() {
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

function reportError(txt,code){
    console.log(txt + ' -- ' + code);
}
