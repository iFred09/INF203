"use strict";

import express from "express";
import morgan from "morgan";
import fs from "fs";

const app = express();
const port = process.argv[2];

// database
let db = [];

// load data from file
function loadDatabase(){
    try {
        const data = fs.readFileSync("db.json", "utf8");
        db = JSON.parse(data);
        console.log("Database loaded successfully.");
    } catch (err) {
        console.error("Error loading database:", err.message);
    }
}

// load the database at startup
loadDatabase();

// logging for requests and using express middleware
app.use(morgan("dev"));
app.use(express.json());

// root request
app.get('/', (req, res) => {
    res.send("Hi!");
    console.log(req.url);
});

// exit request
app.get('/exit', (req, res) => {
    res.send("Bye!");
    console.log(req.url);
    process.exit(0);
});

// restart request
app.get('/restart', (req, res) => {
    loadDatabase();
    res.type("text/plain").send("Restarting the server...");
    console.log(req.url);
});

// count papers request
app.get('/countpapers', (req, res) => {
    try {
        const count = db.length;
        res.type("text/plain").send(String(count));
    } catch (err) {
        console.error("Error reading database:", err.message);
        res.status(500).type("text/plain").send("Error reading database.");
    }
});

// get number of papers by author
app.get('/byauthor/:name', (req, res) => {
    try {
        const authorName = req.params.name;

        // Validate input to allow only alphanumeric characters and spaces
        if (!/^[a-zA-Z0-9\s]+$/.test(authorName)) {
            return res.status(400).type("text/plain").send("Invalid author name.");
        }

        const lowerCaseName = authorName.toLowerCase();

        // Count publications with authors matching the name
        const count = db.filter(pub =>
            pub.authors.some(author => author.toLowerCase().includes(lowerCaseName))
        ).length;

        res.type("text/plain").send(String(count));
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).send("Error processing request.");
    }
});

// get description of papers by author
app.get('/papersdesc/:name', (req, res) => {
    try {
        const authorName = req.params.name;

        // Validate input to allow only alphanumeric characters and spaces
        if (!/^[a-zA-Z0-9\s]+$/.test(authorName)) {
            return res.status(400).type("application/json").send({ error: "Invalid author name." });
        }

        const lowerCaseName = authorName.toLowerCase();

        // Filter publications with authors matching the name
        const matchingPublications = db.filter(pub =>
            pub.authors.some(author => author.toLowerCase().includes(lowerCaseName))
        );

        res.type("application/json").send(matchingPublications);
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).type("application/json").send({ error: "Error processing request." });
    }
});

// get title of papers by author

app.get('/titles/:name', (req, res) => {
    try {
        const authorName = req.params.name;

        // Validate input to allow only alphanumeric characters and spaces
        if (!/^[a-zA-Z0-9\s]+$/.test(authorName)) {
            return res.status(400).type("application/json").send({ error: "Invalid author name." });
        }

        const lowerCaseName = authorName.toLowerCase();

        // Filter titles of publications with authors matching the name
        const matchingTitles = db
            .filter(pub => pub.authors.some(author => author.toLowerCase().includes(lowerCaseName)))
            .map(pub => pub.title);

        res.type("application/json").send(matchingTitles);
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).type("application/json").send({ error: "Error processing request." });
    }
});

// get description of publication by key

app.get('/pubref/:key', (req, res) => {
    try {
        const publicationKey = req.params.key;

        // Validate input to allow only alphanumeric characters, dashes, and colons
        if (!/^[a-zA-Z0-9\-:]+$/.test(publicationKey)) {
            return res.status(400).type("application/json").send({ error: "Invalid publication key." });
        }

        // Find the publication with the matching key
        const publication = db.find(pub => pub.key === publicationKey);

        if (!publication) {
            return res.status(404).type("application/json").send({ error: "Publication not found." });
        }

        res.type("application/json").send(publication);
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).type("application/json").send({ error: "Error processing request." });
    }
});

// delete publication by key

app.delete('/pubref/:key', (req, res) => {
    try {
        const publicationKey = req.params.key;

        // Validate input to allow only alphanumeric characters, dashes, and colons
        if (!/^[a-zA-Z0-9\-:]+$/.test(publicationKey)) {
            return res.status(400).type("application/json").send({ error: "Invalid publication key." });
        }

        // Find the index of the publication with the matching key
        const index = db.findIndex(pub => pub.key === publicationKey);

        if (index === -1) {
            return res.status(404).type("application/json").send({ error: "Publication not found." });
        }

        // Remove the publication from the database
        db.splice(index, 1);

        // Save the updated database to file
        fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

        res.type("application/json").send({ message: "Publication deleted successfully." });
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).type("application/json").send({ error: "Error processing request." });
    }
});

// post imaginary pubref request

app.post('/pubref', (req, res) => {
    try {
        const newPublication = req.body;

        if (
            typeof newPublication.title !== "string" ||
            !Array.isArray(newPublication.authors) ||
            !newPublication.authors.every(author => typeof author === "string")
        ) {
            return res.status(400).type("application/json").send({ error: "Invalid publication data." });
        }

        const sanitizedPublication = {
            key: "imaginary",
            title: newPublication.title.replace(/\s+/g, ""),
            journal: newPublication.journal ? newPublication.journal.replace(/\s+/g, "") : undefined,
            year: newPublication.year ? String(newPublication.year).trim() : undefined,
            authors: newPublication.authors.map(author => author.trim())
        };

        db.push(sanitizedPublication);

        fs.writeFileSync("db.json", JSON.stringify(db, null, 2), "utf8");

        res.type("application/json").send(sanitizedPublication);
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).type("application/json").send({ error: "Error processing request." });
    }
});

// put publication by key
app.put('/pubref/:key', (req, res) => {
    try {
        const publicationKey = req.params.key;

        if (!/^[a-zA-Z0-9\-:]+$/.test(publicationKey)) {
            return res.status(400).type("application/json").send({ error: "Invalid publication key." });
        }

        const updatedFields = req.body;

        if (typeof updatedFields !== "object" || Array.isArray(updatedFields) || updatedFields === null) {
            return res.status(400).type("application/json").send({ error: "Invalid update data." });
        }

        const publication = db.find(pub => pub.key === publicationKey);

        if (!publication) {
            return res.status(404).type("application/json").send({ error: "Publication not found." });
        }

        const allowedFields = ["title", "authors", "year", "category", "state", "dept", "group", "journal"];
        Object.keys(updatedFields).forEach(field => {
            if (allowedFields.includes(field)) {
                publication[field] = typeof updatedFields[field] === "string"
                    ? updatedFields[field].replace(/\s+/g, "")
                    : updatedFields[field];
            }
        });

        fs.writeFileSync("db.json", JSON.stringify(db, null, 2), "utf8");

        res.type("application/json").send(publication);
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).type("application/json").send({ error: "Error processing request." });
    }
});

// launch the server
app.listen(port, () => console.log(`Server listening on port ${port}`));