/* eslint-disable no-undef */

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

function getColor() {
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

function style(feature) {
  return {
    weight: 3,
    opacity: 1,
    color: getColor(),
    fillOpacity: 0.5,
  };
}

//TODO: add error handling
fetch("/trails")
  .then((response) => response.json())
  .then((trails) =>
    L.geoJSON(trails, {
      onEachFeature: onEachFeature,
      style: style,
    }).addTo(map)
  );
