// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const { response } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const fetchGPX = require("./fetchroutes");
const convertGPX = require("./processgpx");

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//need endpoint to trigger import from sources
//should import gpx, convert to one geojson and add to dir

//endpoint for getting all geojson trails in one json object
app.get("/trails", (request, response) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "./geojson/geojson.json")
  );
  let trails = JSON.parse(rawdata);
  response.send(trails);
});

app.get("/convertGPX", (request, response) => {
  //TODO: add error condition here
  convertGPX();
  response.sendStatus(200);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log("Your app is listening on port " + listener.address().port);
});
