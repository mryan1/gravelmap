//TODO: clean up gpx directory before or after fetching

const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();
const https = require("https");
const { resolve } = require("path");
const { v4: uuidv4 } = require("uuid");
const stravaApi = require("strava-v3");

const params = {
  sheetId: "1XvJrmn89OD5V2_1ixNxIJJbd8xfAYiPKveGrQE6EC0c",
  googleApikey: process.env.GOOGLEAPIKEY,
  sheets: [
    "Central Alberta!A:I",
    "Southern Alberta!A:I",
    "Northern Alberta!A:I",
  ],
  stravaRefreshToken: process.env.STRAVA_REFRESH_TOKEN,
};
const fetchRidewithgps = async (uri, uuid, type) => {
  var sanURI;
  if (uri.includes("?")) {
    sanURI = uri.substring(0, uri.indexOf("?")) + ".gpx?sub_format=track";
  } else {
    sanURI = uri + ".gpx?sub_format=track";
  }
  https.get(sanURI, (res) => {
    const path = "./gpx/" + uuid + ".gpx";
    try {
      const filePath = fs.createWriteStream(path);
      console.log("Writing ridewithgps " + type + ": " + path);
      res.pipe(filePath);
      filePath.on("finish", () => {
        filePath.close();
      });
    } catch (err) {
      console.log("Error writing " + path + ". " + err);
    }
  });
};

const fetchStravaRoute = async (uuid, routeId) => {
  const strava = new stravaApi.client(process.env.STRAVA_ACCESS_TOKEN);
  const sr = await strava.routes.getFile(
    { id: routeId, file_type: "gpx" },
    (error, data, response) => {
      const path = "./gpx/" + uuid + ".gpx";
      console.log("Writing strava gpx: " + path + " for route id " + routeId);
      if (error) {
        console.error("Error fetching Strava route: " + error);
      } else {
        fs.writeFile(path, data, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    }
  );
};

const getRouteGPX = (uri, uuid) => {
  if (uri.includes("ridewithgps.com/routes")) {
    fetchRidewithgps(uri, uuid, "route");
  } else if (uri.includes("strava.com/routes")) {
    const regex = /https:\/\/www\.strava\.com\/routes\/(\d+)/;
    const routeId = uri.match(regex)[1];
    fetchStravaRoute(uuid, routeId);
  } else if (uri.includes("strava.com/activities")) {
    console.log("Strava activity not yet supported.");
  } else if (uri.includes("ridewithgps.com/trips")) {
    fetchRidewithgps(uri, uuid, "trip");
  } else {
    console.log("unknown route type! " + uri);
  }
};

async function getSheet(s) {
  const sheets = google.sheets({ version: "v4", auth: params.googleApikey });
  console.log("Downloading " + s);
  try {
    var res = await sheets.spreadsheets.values.get({
      spreadsheetId: params.sheetId,
      range: s,
    });
    return res.data.values;
  } catch (err) {
    console.log("Could connect to API: " + err);
  }
}

async function getRoutes() {
  var routes = [];
  var rows = [];
  for (const x of params.sheets) {
    Array.prototype.push.apply(rows, await getSheet(x));
  }
  if (rows.length) {
    rows.map((row) => {
      const uuid = uuidv4();
      //TODO: should only add routes to manifest that we know we can retrieve.  i.e don't add strava activity
      routes.push({
        name: row[0],
        location: row[1],
        distance: row[2],
        elevation: row[3],
        difficulty: row[4],
        author: row[5],
        routelink: row[6],
        amenities: row[7],
        comments: row[8],
        guid: uuid,
      });
      //if there is a route, get it. Pause  with some random values as not to exhaust network on cheap hosting
      if (row[6]) {
        setTimeout(() => {
          getRouteGPX(row[6], uuid);
        }, Math.floor(Math.random() * 5000));
      }
    });
  } else {
    console.log("No data found.");
  }
  return routes;
}

const refreshStravaToken = async () => {
  var util = require('util');
  const st = await stravaApi.oauth.refreshToken(params.stravaRefreshToken);
  process.env.STRAVA_ACCESS_TOKEN = st["access_token"]
  process.env.STRAVA_REFRESH_TOKEN = st["refresh_token"]
};



const writeManifest = async () => {
  //call fuction to update strava access token
  const token = await refreshStravaToken();
  const r = await getRoutes();

  fs.writeFile("./manifest.json", JSON.stringify(r), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("Wrote manifest successfully.");
  });
};

module.exports = { writeManifest };