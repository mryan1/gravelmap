const tj = require("@tmcw/togeojson");
const fs = require("fs");
const path = require("path");
const xmldom = require("@xmldom/xmldom");
const gpxDir = "./gpx/";
const tracks = { type: "FeatureCollection", features: [] };

convert = () => {
  fs.readdirSync(gpxDir).forEach((file) => {
    const gpx = new xmldom.DOMParser().parseFromString(
      fs.readFileSync(gpxDir + file).toString("utf8"),
      "utf8"
    );
    //TODO: handle malformed gpx files
    var converted = JSON.stringify(tj.gpx(gpx).features[0]);
    tracks.features.push(JSON.parse(converted));
  });

  fs.writeFile("./geojson/geojson.json", JSON.stringify(tracks), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("Wrote geojson successfully.");
  });
};

module.exports = convert;
