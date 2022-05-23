const tj = require("@tmcw/togeojson");
const fs = require("fs");
const path = require("path");
const xmldom = require("@xmldom/xmldom");

//add loop for each file in gpx dir and append them all to one geojson object
const gpx = new xmldom.DOMParser().parseFromString(fs.readFileSync(path.resolve(__dirname, "./gpx/Vermilion.gpx")).toString('utf8'), "utf8");
const converted = JSON.stringify(tj.gpx(gpx));

fs.writeFile('./geojson/geojson.json', converted, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});