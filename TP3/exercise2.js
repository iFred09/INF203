"use strict";

function sendChat() {
    /**
     * Send the chat message to the server using AJAX
     */
    let textedit = document.getElementById("textedit");
    let phrase = textedit.value;
    if (phrase.trim() !== "") {
        console.info("Sending phrase: " + phrase);
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "chat.php?phrase=" + encodeURIComponent(phrase), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.info("Phrase sent successfully");
            }
        };
        xhr.send();
        textedit.value = "";
    }
}

function loadChat() {
    /**
     * Print the chat log in the textarea element using AJAX, showing the last 10 messages with the most recent at the top
     */
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "chatlog.txt", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let lines = xhr.responseText.trim().split("\n").reverse().slice(0, 10);
            let textarea = document.getElementById("texta");
            textarea.innerHTML = "";
            lines.forEach(line => {
                if (line.trim() !== "") {
                    let p = document.createElement("p");
                    p.textContent = line;
                    textarea.appendChild(p);
                }
            });
        }
    };
    xhr.send();
    console.info("Chat reloaded");
    setTimeout(loadChat, 1000);
}

/**
 * Add event listeners to the space bar key in the text area
 */
document.getElementById("textedit").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendChat();
    }
});

/**
 * Start loading the chat log when the page is loaded
 */
window.addEventListener("load", loadChat);