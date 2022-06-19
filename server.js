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

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//endpoint for getting all geojson trails in one json object
app.get("/trails", (request, response) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "./geojson/geojson.json")
  );
  let trails = JSON.parse(rawdata);
  response.set('Cache-control', 'public, max-age=21600')

  response.send(trails);
});

app.get("/convertGPX", (request, response) => {
  //TODO: add error condition here
  convertGPX.processManifest();
  response.sendStatus(200);
});

app.get("/fetchGPX", (request, response) => {
  //TODO: add error condition here
  fetchGPX.writeManifest();
  response.sendStatus(200);
});

const listener = app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Your app is listening on port " + listener.address().port);
});
