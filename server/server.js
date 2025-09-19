import fs from "node:fs";
import ollama from "ollama";
import https from "https";
import cors from "cors";
import fileUpload from "express-fileupload";
import express from "express";

const port = 443;
const app = express();

// Load your SSL certificate and private key
const privateKey = fs.readFileSync('localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('localhost.pem', 'utf8');

const passphrase = '.ricbuz94'; // Replace with your passphrase
const credentials = { key: privateKey, passphrase, cert: certificate };

// Create an HTTPS server with your Express app
const httpsServer = https.createServer(credentials, app);

// Define a middleware to redirect HTTP to HTTPS
function ensureSecure(req, res, next) {
    if (req.secure) {
        // Request is already secure (HTTPS)
        return next();
    }
    // Redirect to HTTPS version of the URL
    res.redirect('https://' + req.hostname + req.originalUrl);
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

app.use(ensureSecure, cors(), fileUpload());

app.get("/", (req, res) => res.send("DeepSeek R1 Server is running..."));

app.get("/chat", async (req, res) => {
    if (!req || !req.query.mex) {
        return res.status(400).send("Bad request.");
    }

    console.log("query sent: %o\n", req.query);

    if (!!req.query.fake) {
        const fakeResponse = {
            mex: "Messaggio di test per provare le funzionalità lato client.",
            mod: "DeepSeek R1"
        };

        await sleep(5000);
        console.log(fakeResponse);
        return res.json(fakeResponse);
    }

    try {
        const response = await ollama.chat({
            model: "deepseek-r1:8b",
            stream: false,
            messages: [{ role: "user", content: req.query.mex }],
        });
        console.log("\nresponse: %o\n", response);
        return res.json({
            mex: response?.message?.content || "[EMPTY]: Testo vuoto.",
            mod: response?.model
        });
    } catch (err) {
        console.log(err);
        return res.status(err?.response?.status || 500).send(err?.response?.message || err);
    }
});

app.post("/chat", async (req, res) => {
    if (!req || !req.body.mex) {
        return res.status(400).send("Bad request.");
    }

    console.log("query sent: %o\n", req.query);

    try {
        const response = await ollama.chat({
            model: "deepseek-r1:8b",
            stream: false,
            messages: [{ role: "user", content: req.query.mex }],
        });
        console.log("\nresponse: %o\n", response);
        return res.json({
            mex: response?.message?.content || "[EMPTY]: Non ho capito.",
            mod: response?.model
        });
    } catch (err) {
        console.log(err);
        return res.status(err?.response?.status || 500).send(err?.response?.message || err);
    }
});

httpsServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
