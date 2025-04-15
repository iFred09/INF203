"use strict";

function loadDoc() {
    /**
     * Print the text file in the textarea element using AJAX
     */
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "text.txt", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("texta").textContent = xhr.responseText;
        }
    };
    xhr.send();
}

function loadDoc2() {
    /**
     * Print each line of the text file in a new paragraph of area2 with a random color for each line using AJAX
     */
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "text.txt", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let lines = xhr.responseText.split("\n");
            let area2 = document.getElementById("texta2");
            area2.innerHTML = ""; // Clear previous content
            lines.forEach(line => {
                let p = document.createElement("p");
                p.textContent = line;
                area2.appendChild(p);
                // random color in hex
                p.style.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
            });
        }
    };
    xhr.send();
}

/**
 * Add event listeners to the buttons
 */
document.getElementById("button1").addEventListener("click", loadDoc);
document.getElementById("button2").addEventListener("click", loadDoc2);