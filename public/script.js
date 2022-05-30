/* eslint-disable no-undef */

// config map
let config = {
  minZoom: 6,
  maxZoom: 25
};
// magnification with which the map will start
const zoom = 5;
// co-ordinates
const lat = 53.5461;
const lng = -113.4938;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

//TODO: add error handling 
//TODO: Show details when trail is clicked
fetch("/trails")
  .then(response => response.json())
  .then(trails => L.geoJSON(trails, {
    onEachFeature: onEachFeature
  }).addTo(map))

console.log("Trails:")
console.log(L)
//L.geoJSON().getFeature()