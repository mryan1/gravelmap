/* eslint-disable no-undef */
var showDifficulty = false;

let config = {
  minZoom: 6,
  maxZoom: 25,
};

const zoom = 5;
const lat = 52.5461;
const lng = -113.4938;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

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
    case 1:
      return "#00ff11";
    case 2:
      return "#94f56e";
    case 3:
      return "#c6ff5c";
    case 4:
      return "#f1ff5c";
    case 5:
      return "#ffe95c";
    case 6:
        return "#ffd45c";
    case 7:
      return "#ffb65c";
    case 8:
        return "#ff6f1c";
    case 9:
      return "#ff410d";
    case 10:
        return "#ff0d0d";
    default:
      return "#807b7a";

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

function updateRouteColors() {
  if (showDifficulty) {
    showDifficulty = false;
  }
  else {
    showDifficulty = true;
  }

  trailLayer.resetStyle();

};
