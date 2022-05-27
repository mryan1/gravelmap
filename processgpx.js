const tj = require("@tmcw/togeojson");
const fs = require("fs");
const path = require("path");
const xmldom = require("@xmldom/xmldom");
const gpxDir = "./gpx/";

const tracks = { type: "FeatureCollection", features: [] };

//load manifest.json, for each item, convert to geojson, add metadata, then append to file

const manifest = JSON.parse(fs.readFileSync("manifest.json"));

manifest.map((m) => {
  const gpxFileName = gpxDir + m.guid + ".gpx";
  console.log("Processing: " + gpxFileName)
  if (fs.existsSync(gpxFileName)) {
    const gpx = new xmldom.DOMParser().parseFromString(
      fs.readFileSync(gpxFileName).toString("utf8"),
      "utf8"
    );
    //TODO: handle malformed gpx files
    var converted = JSON.stringify(tj.gpx(gpx).features[0]);
    //console.log(converted)
    tracks.features.push(JSON.parse(converted));
    //TODO: add feature property like:  "popupContent":"This is the pop-up."
  }
});

fs.writeFile("./geojson/geojson.json", JSON.stringify(tracks), (err) => {
  if (err) {
    console.error(err);
  }
  console.log("Wrote geojson successfully.");
});
