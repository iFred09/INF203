"use strict";

import {createServer} from "http";
import {readFileSync, existsSync, promises as fs} from "fs";
import {join, extname, normalize} from "path";
import { parse } from "url";

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

let users = [];

// Sanitize user input to prevent XSS
function sanitize(input) {
    return input.replace(/</g, "_").replace(/>/g, "_");
}

// handle requests
function webserver( request, response ) {
    let parsedUrl = parse(request.url, true);
    let pathname = parsedUrl.pathname;
    if (pathname === "/exit") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    }
    else if (pathname.startsWith("/files/")) {
        const filepath = normalize(join(process.cwd(), pathname.replace("/files/", "")));

        // prevent access to parent directories
        if (filepath.startsWith("..")) {
            response.writeHead(403, { "Content-Type": "text/plain" });
            response.end("403 Forbidden: Access denied.");
            return;
        }
        
        try{
            if (existsSync(filepath)){
                let data = readFileSync(filepath);
                let ext = extname(filepath);
                response.writeHead(200, { "Content-Type": mimeTypes[ext] });
                response.write(data);
                response.end();
            }
            else{
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.end("404 Not Found: File not found.");
            }
        }
        catch(err){
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("500 Internal Server Error: " + err.message);
        }
    }
    else if (pathname.startsWith("/hi")){
        let visiteur = parsedUrl.query.visiteur ? decodeURIComponent(parsedUrl.query.visiteur) : "anonymous";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>hi " + visiteur + "</body></html>");
    }
    else if (pathname.startsWith("/coucou")){
        let user = parsedUrl.query.user ? sanitize(decodeURIComponent(parsedUrl.query.user)) : "anonymous";
        
        const userList = users.join(", ");
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>coucou " + user + ", the following users have already visited this page: " + userList + "</body></html>");
        users.push(user);
    }
    else if (pathname.startsWith("/clear")){
        users = [];
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>All users have been cleared</body></html>");
    }
    else{
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Server is working</body></html>");
    }
}

// instanciate server
const server = createServer(webserver);

// server starting
server.listen(process.argv[2], (err) => {});