"use strict";

let slides;
let slideIndex = -1;
let numSlides = 0;
let pause = false;
let div = document.getElementById("TOP");
let pauseButton = document.getElementById("PAUSE");


function loadSlides() {
    /**
     * Load the slides from the JSON file and start the slideshow
     */
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "slides.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                slides = JSON.parse(xhr.responseText).slides;
                numSlides = slides.length;
            } catch (e) {
                console.error("Error parsing JSON: " + e);
                return
            }
            console.log("Slides loaded successfully : " + numSlides + " slides found");
        }
    };
    xhr.send();
}

function playSlide(){
    let url = slides[slideIndex].url

    for (let i = 0; i < div.childNodes.length; i++) {
        div.removeChild(div.childNodes[i]);
    }

    if (url) {
        console.log("Showing slide " + slideIndex + " : " + url);
        let iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.width = "100%";
        iframe.height = "500px";
        div.appendChild(iframe);
    } else {
        console.log("No slide found at index: " + slideIndex);
    }
}

function playSlideshow() {
    /**
     * Play the slideshow using the slides array
     */
    console.log("Starting slideshow");
    slideIndex = 0;
    playSlide();
    setTimeout(nextSlide, 2000, false);
}

function pauseResumeSlideshow(){
    pause = !pause;
    console.log(pause ? "Pausing slideshow" : "Resuming slideshow");
    pauseButton.innerHTML = pause ? "Resume" : "Pause";
    if (!pause){
        nextSlide();
    }
}

function nextSlide(force){
    if (pause && !force){
        console.log("Slide show paused, waiting for resume before next slide");
        return;
    }
    slideIndex ++;
    if (slideIndex >= numSlides){
        slideIndex = numSlides - 1;
        if (!force){
            div.innerHTML = "";
            console.log("End of slideshow");
        } else {
            console.log("Slide index max reached: " + slideIndex);
        }
        return;
    }
    console.log("Going to next slide");
    playSlide();
    if (!force){
        setTimeout(nextSlide, 2000, false)
    }
}

function prevSlide(){
    if (slideIndex <= 0){
        console.log("No previous slide")
        return;
    }
    slideIndex --;
    console.log("Going to previous slide");
    playSlide();
}



/**
 * Load the slides after the page has loaded
 */
window.addEventListener("load", loadSlides);