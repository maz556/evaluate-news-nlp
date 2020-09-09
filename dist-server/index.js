"use strict";

var _express = _interopRequireDefault(require("express"));

var _mockAPI = _interopRequireDefault(require("./mockAPI.js"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _bodyParser = require("body-parser");

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = require("dotenv");

var _formEnum = require("./formEnum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)(); // Middleware
// Here we are configuring express to use body-parser as middle-ware.

app.use((0, _bodyParser.urlencoded)({
  extended: false
}));
app.use((0, _bodyParser.json)()); // Cors for cross origin allowance

app.use((0, _cors.default)());
app.use(_express.default.static('dist'));
console.log(__dirname);
(0, _dotenv.config)();
const API_KEY = process.env.API_KEY;
app.get('/', function (_req, res) {
  res.sendFile('dist/index.html');
}); // designates what port the app will listen to for incoming requests

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
app.get('/test', function (_req, res) {
  console.log(_formEnum.formTypes.INV);
  res.send(_mockAPI.default);
});

function getApiUrl(data) {
  return `https://api.meaningcloud.com/sentiment-2.1?key=${API_KEY}` + `&lang=en&${data.type == _formEnum.formTypes.URL ? "url" : "txt"}=${data.input}`;
}

app.post('/eval', async (req, res) => {
  try {
    console.log('Sending submission to MeaningClougAPI...');
    const mc_resp = await (0, _nodeFetch.default)(getApiUrl(req.body), {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
    console.log("Response recieved!");
    const mc_json = await mc_resp.json();
    res.send({
      score: mc_json.score_tag
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});