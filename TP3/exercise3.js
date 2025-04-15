"use strict";

let slides = [];

function loadSlides() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "slides.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                slides = JSON.parse(xhr.responseText).slides;
                console.log("Slides loaded successfully:", slides);
            } catch (e) {
                console.error("Failed to parse slides JSON: " + e);
                return;
            }
        }
    };
    xhr.send();
}

function playSlide(url){
    let div = document.getElementById("TOP");
    div.innerHTML = ""; // Clear previous content

    if (url){
        console.log("Playing slide:", url);
        let iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.style.border = "none";
        div.appendChild(iframe);
    }
}

function playSlideshow(){
    for(let i in slides){
        setTimeout(playSlide, slides[i].time * 1000, slides[i].url);
    }
}

window.addEventListener("load", loadSlides);