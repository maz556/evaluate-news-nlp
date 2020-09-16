import express from 'express';
import mockAPIResponse from './mockAPI.js';
import fetch from 'node-fetch';
import { urlencoded, json } from "body-parser";
import cors from "cors";
import { config } from 'dotenv';
import { formTypes } from './formEnum';

const app = express()

// Middleware
// Here we are configuring express to use body-parser as middle-ware.
app.use(urlencoded({ extended: false }));
app.use(json());

// Cors for cross origin allowance
app.use(cors());

app.use(express.static('dist'))

console.log(__dirname)

config()
const API_KEY = process.env.API_KEY

app.get('/', function (_req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/test', function (_req, res) {
    console.log(formTypes.INV)
    res.send(mockAPIResponse)
})

function getApiUrl(data) {
    return `https://api.meaningcloud.com/sentiment-2.1?key=${API_KEY}` +
    `&lang=en&${data.type == formTypes.URL ? "url" : "txt"}=${data.input}`;
}

app.post('/eval', async (req, res) => {
    try {
        console.log('Sending submission to MeaningCloud API...')
        const mc_resp = await fetch(getApiUrl(req.body), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });
        console.log("Response received!!")
        const mc_json = await mc_resp.json()
        res.send({
            score: mc_json.score_tag,
            agreement: mc_json.agreement,
            subjectivity: mc_json.subjectivity,
            irony: mc_json.irony,
            confidence: `${mc_json.confidence}%`
        })
    } catch(err) {
        res.status(500).send(err.message)
    }
})