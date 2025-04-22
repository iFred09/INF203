"use strict";

function showText() {
    /**
     * Print the text file in the textarea
     */
    console.info("showText called");
    let request = new XMLHttpRequest();
    request.open("GET", "../../Show");
    request.onreadystatechange = function () {
        if (this.status === 200) {
            document.getElementById("MAINSHOW").textContent = request.responseText;
        } else {
            
            document.getElementById("MAINSHOW").textContent = "Error";
            console.error("Error: " + request.status);
        }
    };
    request.send();
}

function showAdd(){
    /**
     * Show the add element form
     */
    console.info("showAdd called");
    document.getElementById("addForm").style.visibility = "visible";
}
function addElement(){
    /**
     * Add a new element to the JSON file
     */
    console.info("addElement called");
    let request = new XMLHttpRequest();
    let title = document.getElementById("titleTF").value;
    let value = document.getElementById("valueTF").value;
    let color = document.getElementById("colorTF").value;
    if (title === "" || value === "" || color === "") {
        alert("Please fill in all fields");
        console.log("Some fields are empty");
        return;
    }
    request.open("GET", "../../add?title=" + title + "&value=" + value + "&color=" + color);
    request.onreadystatechange = function () {
        if (this.status === 200) {
            document.getElementById("addForm").style.visibility = "hidden";
            document.getElementById("titleTF").value = "";
            document.getElementById("valueTF").value = "";
            document.getElementById("colorTF").value = "";
        } else {
            console.error("Error: " + request.status);
        }
    }
    request.send();
}

function showRemove(){
    /**
     * Show the remove element form
     */
    console.info("showRemove called");
    document.getElementById("removeForm").style.visibility = "visible";
}

function removeElement(){
    /**
     * Remove an element from the JSON file
     */
    console.info("removeElement called");
    let request = new XMLHttpRequest();
    let index = document.getElementById("indexTF").value;
    if (index === "") {
        alert("Please fill in the index field");
        console.log("Index field is empty");
        return;
    }
    request.open("GET", "../../remove?index=" + index);
    request.onreadystatechange = function () {
        if (this.status === 200) {
            document.getElementById("removeForm").style.visibility = "hidden";
            document.getElementById("indexTF").value = "";
        } else {
            console.error("Error: " + request.status);
        }
    }
    request.send();
}

function clearData(){
    /**
     * Clear the data in the JSON file
     */
    console.info("clear called");
    let request = new XMLHttpRequest();
    request.open("GET", "../../clear");
    request.onreadystatechange = function () {
        if (this.status !== 200) {
            console.error("Error: " + request.status);
        }
    }
    request.send();
}

function restoreData(){
    /**
     * Restore the data in the JSON file
     */
    console.info("restore called");
    let request = new XMLHttpRequest();
    request.open("GET", "../../restore");
    request.onreadystatechange = function () {
        if (this.status !== 200) {
            console.error("Error: " + request.status);
        }
    }
    request.send();
}

function showPieChart(){
    /**
     * Show the pie chart
     */
    console.info("showPieChart called");
    let request = new XMLHttpRequest();
    request.open("GET", "../../PieCh");
    request.onreadystatechange = function () {
        if (this.status === 200) {
            document.getElementById("pieDiv").innerHTML = request.responseText;
        } else {
            console.error("Error: " + request.status);
        }
    }
    request.send();
}

function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * (percent - 0.25));
    const y = Math.sin(2 * Math.PI * (percent - 0.25));
    return [x, y];
}

function showLocalPieChart() {
    /* use the relative URL /Data to get the JSON, then create the SVG directly into the local browser and then insert it into the HTML to display it. */
    let req = new XMLHttpRequest();
    req.open('GET', '../../Show');
    req.onload = function () {
        let text_slices = this.responseText;
        let slices = JSON.parse(text_slices)
        let pie_div = document.getElementById("pieDiv");
        if (pie_div.childElementCount !== 0) {
            pie_div.innerHTML = "";
        }
        let SVGPie = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        SVGPie.setAttribute("id", "pieChart");
        SVGPie.setAttribute('viewBox', "-1 -1 2 2");
        SVGPie.setAttribute("height", 500);
        SVGPie.setAttribute("width", 500);

        let value_tot = 0;
        for (let slice of slices) {
            value_tot += new Number(slice.value);
        }
        let cum = 0;
        for (let slice of slices) {
            let percent = slice.value / value_tot;
            let [x_start, y_start] = getCoordinatesForPercent(cum);
            cum += percent;
            let [x_end, y_end] = getCoordinatesForPercent(cum);

            let largeArcFlag = percent > .5 ? 1 : 0;

            let pathData = [
                `M ${x_start} ${y_start}`,
                `A 1 1 0 ${largeArcFlag} 1 ${x_end} ${y_end}`,
                `L 0 0`,
            ].join(' ');

            let pathPie = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathPie.setAttribute('d', pathData);
            pathPie.setAttribute('fill', slice.color);
            SVGPie.appendChild(pathPie);
        }
        pie_div.appendChild(SVGPie)

    }
    req.send();
}

// Event listeners for buttons
document.getElementById("SUBMITADD").addEventListener("click", addElement);
document.getElementById("DOREM").addEventListener("click", removeElement);