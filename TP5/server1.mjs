"use strict";

import {createServer} from "http";
import fs from "fs";
import url from "url";
import querystring from "querystring";
import {extname} from "path";

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".txt": "text/plain",
    ".pdf": "application/pdf",
    ".mjs": "application/javascript",
};

// Function to get coordinates for pie chart slices
function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * (percent - 0.25));
    const y = Math.sin(2 * Math.PI * (percent - 0.25));
    return [x, y];
}

// handle requests
function webserver( request, response ) {

    let url_parse = url.parse(request.url);
    let pathname = url_parse.pathname;

    console.log("-".repeat(30), "New request", "-".repeat(30));
    console.log("Request URL:", request.url);
    console.log("Pathname:", pathname);

    if (pathname === "/") {
        response.writeHeader(200, { 'Content-Type': 'text/html' });
        response.write('Server works', 'utf8');
        response.end();
        return;
    } else if (pathname === "/kill") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    } else if (pathname.startsWith("/files/")) {
        const filePath = pathname.replace("/files/", "");
        console.log("File path:", filePath);

        // Check if the file exists in the server directory
        if (filePath.startsWith("..")) {
            response.writeHead(403, {"Content-Type": "text/html; charset=utf-8"});
            response.end("<!doctype html><html><body>Access denied</body></html>");
            return;
        }

        try {
            const fileContent = fs.readFileSync(filePath);
            const ext = extname(filePath).toLowerCase()
            const mimeType = mimeTypes[ext] || "application/octet-stream";

            response.writeHead(200, {"Content-Type": mimeType});
            response.write(fileContent);
            response.end()
        } catch (error) {
            console.log("File path:", filePath);
            console.error("Error reading file:", error);
            response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
            response.end("<!doctype html><html><body>File not found</body></html>");
        }
    } else if (pathname.startsWith("/Show")) {
        if (!fs.existsSync("storage.json")) {
            console.error("File not found");
        } else {
            let data = fs.readFileSync("storage.json")
            response.writeHeader(200, {'Content-Type': 'application/json'})
            response.write(data);
            response.end();
        }
    } else if (pathname === "/Items") {
        const storageFile = "storage.json";
        if (!fs.existsSync(storageFile)) {
            console.error("File not found");
            response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            response.end("<!doctype html><html><body>File not found</body></html>");
        } else {
            const data = JSON.parse(fs.readFileSync(storageFile, "utf8"));
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify(data, null, 2));
        }
    } else if (pathname.startsWith("/add")) {
        let query = querystring.parse(url_parse.query);
        console.log(query);
        let value = parseInt(query.value, 10);
        let title = query.title;
        let color = query.color;

        if (value === undefined || title === undefined || color === undefined) {
            throw new Error('400');
        }

        let data = fs.readFileSync("storage.json");
        let json = JSON.parse(data);
        let new_data = {"title": title, "value": value, "color": color};
        json.push(new_data);
        fs.writeFileSync("storage.json", JSON.stringify(json));
        response.writeHeader(200, {'Content-Type': 'text/html'});
        response.write('Data added', 'utf8');
        response.end();
    } else if (pathname.startsWith("/remove")) {
        let query = querystring.parse(url_parse.query);
        console.log(query);
        let index = parseInt(query.index, 10);

        if (index === undefined) {
            throw new Error('400');
        }

        let data = fs.readFileSync("storage.json");
        let json = JSON.parse(data);
        json.splice(index, 1);
        fs.writeFileSync("storage.json", JSON.stringify(json));
        response.writeHeader(200, {'Content-Type': 'text/html'});
        response.write('Data removed, index ' + index, 'utf8');
        response.end();
    } else if (pathname.startsWith("/clear")) {
        fs.writeFileSync("storage.json", JSON.stringify([{"title": "empty", "color": "red", "value": 1}]));
        response.writeHeader(200, {'Content-Type': 'text/html'});
        response.write('Data cleared', 'utf8');
        response.end();
    } else if (pathname.startsWith("/restore")) {
        fs.writeFileSync("storage.json", JSON.stringify([
            {
                "title": "foo1",
                "color": "red",
                "value": 20
            },
            {
                "title": "foo2",
                "color": "green",
                "value": 50
            },
            {
                "title": "foo3",
                "color": "blue",
                "value": 30
            }]));
        response.writeHeader(200, {'Content-Type': 'text/html'});
        response.write('Data restored', 'utf8');
        response.end();
    } else if (pathname.startsWith("/PieCh")) {
        let slices = JSON.parse(fs.readFileSync("storage.json"));
        let rep = '<svg id="pieChart" viewBox="-1 -1 2 2" height=500 width=500>';
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

            rep += '<path d="' + pathData + '" fill="' + slice.color + '"></path>';
        }
        rep += '</svg>'
        response.writeHeader(200, { "Content-Type": "image/svg+xml" });
        response.write(rep);
        response.end();
    } else {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Server works!</body></html>");
    }
}

// instanciate server
const server = createServer(webserver);

// server starting
server.listen(process.argv[2], (err) => {});