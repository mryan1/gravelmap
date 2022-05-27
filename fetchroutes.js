//read in each tab from the google spreadsheet and store as object
//object should have some methods to fetch gpx
// needs to have properties to populate the pop-ups with

const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();
//const gpx = require("./processgpx");
const https = require("https");
const { v4: uuidv4 } = require("uuid");

const params = {
  sheetId: "1XvJrmn89OD5V2_1ixNxIJJbd8xfAYiPKveGrQE6EC0c",
  apikey: process.env.GOOGLEAPIKEY,
};

const getRouteGPX = (uri, uuid) => {
  //determine if route is ridewithgps, strava route, or strava activity and fetch accordingly
  if (uri.includes("ridewithgps.com/routes")) {
    if(uri.includes("?")){
      const sanURI = uri.substring(0, uri.indexOf('?') -1) + ".gpx?sub_format=track"
    }
    else{
      sanURI = uri + ".gpx?sub_format=track"
    }
    console.log(sanURI)
    //console.log("Route link:" + uri.substring(0, uri.indexOf('?') -1) + ".gpx?sub_format=track");
    //https://ridewithgps.com/routes/35088794.gpx?sub_format=track
    //https://ridewithgps.com/routes/35088794
    //Route link:https://ridewithgps.com/routes/38516268?fbclid=IwAR22xU5TSXcdCsHWMhV0Vktx73uP8FFvP3rSIHN20Ku7KsNT-RLA43AfVNA.gpx?sub_format=track
    https.get(sanURI, (res) => {
      // Image will be stored at this path
      const path = "./gpx/" + uuid + ".gpx";
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on("finish", () => {
        filePath.close();
        console.log("Download Completed");
      });
    });

    console.log("ridewithgps route!");
  } else if (uri.includes("strava.com/routes")) {
    console.log("Strava route!");
  } else if (uri.includes("strava.com/activities")) {
    console.log("Strava activity!");
  } else if (uri.includes("ridewithgps.com/trips")) {
    console.log("ridewithgps trip!");
  } else {
    console.log("unknown route type!");
  }
};

//TODO: iterate though each sheet (tab at the bottom)
const getRoutes = (callback) => {
  const sheets = google.sheets({ version: "v4", auth: params.apikey });

  sheets.spreadsheets.values.get(
    {
      spreadsheetId: params.sheetId,
      range: "A:I",
    },
    (err, res) => {
      var routes = []
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
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
          getRouteGPX(row[6], uuid);
        });
      } else {
        console.log("No data found.");
      }
        callback(routes);
    }
  );
};

  getRoutes((r) => {
    fs.writeFile("./manifest.json", JSON.stringify(r), (err) => {
      if (err) {
        console.error(err);
      }
      console.log("Wrote manifest successfully.");
    });
  });
