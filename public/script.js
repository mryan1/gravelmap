/* eslint-disable no-undef */
var showDifficulty = false;

// config map
let config = {
  minZoom: 6,
  maxZoom: 25,
};
// magnification with which the map will start
const zoom = 5;
// co-ordinates
const lat = 52.5461;
const lng = -113.4938;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
//https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
//https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}
L.tileLayer(
  "https://api.mapbox.com/styles/v1/mryan21/cl3tm406v000g14o323u83bzf/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJ5YW4yMSIsImEiOiJjbDN0bTZlY3MwMGVtM2twZXI3a2FieTk5In0.FAQ3PX9gsptcQ-fITDWB7g",
  {
    attribution: `© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>`,
  }
).addTo(map);

function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

function getRandomColor() {
  const colors = [
    "#D35400",
    "#F1C40F",
    "#27AE60",
    "#3498DB",
    "#8E44AD",
    "#E74C3C",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 1 || 2:
      return "#03fc0b";
      break;
    case 3 || 4: 
      return "#f2f558";
    case 5 || 6: 
      return "#f5ce58";
    case 7 || 8:
      return "#f58758";
    case 9 || 10:
      return "#f70505";
    default:
      return "#414245";

  }

}

function style(feature) {
  d = parseInt(feature.properties.difficulty)
  if (showDifficulty) {
    return {
      weight: 3,
      opacity: 1,
      color: getDifficultyColor(d),
      fillOpacity: 0.5,
    };
  }
  else {
    return {
      weight: 3,
      opacity: 1,
      color: getRandomColor(),
      fillOpacity: 0.5,
    };
  }
}

trailLayer = L.geoJSON(null, {
  onEachFeature: onEachFeature,
  style: style,
}).addTo(map)

fetch("/trails")
  .then((response) => response.json())
  .then((trails) => {

    trailLayer.addData(trails)
    trailLayer.setStyle(style)
  });

  function updateRouteColors(){
    if (showDifficulty){
      showDifficulty = false;
    }
    else{
      showDifficulty = true;
    }

    trailLayer.resetStyle();

  };
