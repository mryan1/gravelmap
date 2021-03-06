const tj = require("@tmcw/togeojson");
const fs = require("fs");
const path = require("path");
const xmldom = require("@xmldom/xmldom");
const { resolve } = require("path");
const { features } = require("process");
const gpxDir = "./gpx/";

const createManifest = () => {
  var manifest = '{}'
  try{
    manifest = JSON.parse(fs.readFileSync("manifest.json"));
    return manifest
    }
    catch{
      console.log("Manifest doesn't exist so making one.")
      fs.writeFile("./manifest.json", manifest, (err) => {
      if (err)
        console.log(err);
      })
      return manifest
    };

}


const xmlToDom = (gpxFileName) => {
  //TODO: handle malformed gpx files
  if (fs.existsSync(gpxFileName)) {
    try {
      return new xmldom.DOMParser().parseFromString(
        fs.readFileSync(gpxFileName).toString("utf8"),
        "utf8"
      );
    } catch {
      console.log("Can't convert the gpx to DOM");
      return false;
    }
  }
};

const processManifest = async () => {
  manifest = createManifest();
  const tracks = { type: "FeatureCollection", features: [] };
  manifest.map((m) => {
    const gpxFileName = gpxDir + m.guid + ".gpx";
    console.log("Processing: " + gpxFileName);
    const gpx = xmlToDom(gpxFileName);
    if (gpx) {
      try {
        var converted = tj.gpx(gpx).features[0];
        converted.properties.popupContent = `<p> <b>${m.name}</b> <br /> Distance: ${m.distance}km <br /> Elevatoin: ${m.elevation}m <br /> Author: ${m.author}
        <br /> <a href="${m.routelink}" target="_blank" rel="noopener noreferrer">Route Link</a> <br /> Amenities: ${m.amenities} <br /> Comments: ${m.comments}</p>`;
        converted.properties.difficulty = m.difficulty;
        tracks.features.push(converted);
      } catch {
        console.log("Couldn't convert " + gpxFileName + " to JSON");
      }
    }
    else{
      console.log("Failed to convert gpx to Dom")
    };
  });
  await writeGeojson(JSON.stringify(tracks));
};

const writeGeojson = (tracks) => {
  fs.writeFile("./geojson/geojson.json", JSON.stringify(tracks), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("Wrote geojson successfully.");
  });
};

module.exports = { processManifest };