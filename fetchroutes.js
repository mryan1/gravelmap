//read in each tab from the google spreadsheet and store as object
//object should have some methods to fetch gpx
// needs to have properties to populate the pop-ups with

const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();
const https = require("https");
const { resolve } = require("path");
const { v4: uuidv4 } = require("uuid");

const params = {
  sheetId: "1XvJrmn89OD5V2_1ixNxIJJbd8xfAYiPKveGrQE6EC0c",
  apikey: process.env.GOOGLEAPIKEY,
  sheets: [
    "Central Alberta!A:I",
    "Southern Alberta!A:I",
    "Northern Alberta!A:I",
  ],
};

const getRouteGPX = (uri, uuid) => {
  if (uri.includes("ridewithgps.com/routes")) {
    var sanURI;
    if (uri.includes("?")) {
      sanURI = uri.substring(0, uri.indexOf("?") - 1) + ".gpx?sub_format=track";
    } else {
      sanURI = uri + ".gpx?sub_format=track";
    }
    https.get(sanURI, (res) => {
      // Image will be stored at this path
      const path = "./gpx/" + uuid + ".gpx";
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => {
        filePath.close();
      });
    });
  } else if (uri.includes("strava.com/routes")) {

  } else if (uri.includes("strava.com/activities")) {

  } else if (uri.includes("ridewithgps.com/trips")) {

  } else {
    console.log("unknown route type!");
  }
};

async function getSheet(s) {
  const sheets = google.sheets({ version: "v4", auth: params.apikey });
  console.log("Downloading " + s);
  try {
    var res = await sheets.spreadsheets.values.get(
      {
        spreadsheetId: params.sheetId,
        range: s,
      }
    )
    return res.data.values
  }
  catch (err) {
    console.log("Could connect to API: " + err)
  }
};



async function getRoutes() {
  var routes = [];
  var rows = [];
  for (const x of params.sheets) {
    Array.prototype.push.apply(rows, (await getSheet(x)));
  }
  if (rows.length) {
    rows.map((row) => {
      //create JSON object for each row
      const uuid = uuidv4();
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
      if (row[6]) {
        getRouteGPX(row[6], uuid);
      }
      //console.log(routes)
    });
  } else {
    console.log("No data found.");
  }
  return routes;
};

const writeManifest = async () => {
  r = await getRoutes()
  fs.writeFile("./manifest.json", JSON.stringify(r), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("Wrote manifest successfully.");
  });
};
writeManifest();