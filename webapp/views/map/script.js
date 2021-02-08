/* global $, L, t, lat, lon, geoserverUrl, services */

const map = new L.Map('map', {
  center: new L.LatLng(lat, lon),
  zoom: 13,
  minZoom: 4,
  touchZoom: true,
  renderer: L.canvas()
});

map.doubleClickZoom.disable(); 

const rasterWMS = geoserverUrl + 'geoserver/raster/wms';
const vectorWMS = geoserverUrl + 'geoserver/vector/wms';

// Background map
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const hot = L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; Humanitarian map style by <a href="https://www.hotosm.org/">HOT</a>'
});

// Drawings
const drawnItems = L.featureGroup().addTo(map);

// Control for map legends
L.control.legend(
  { position: 'bottomleft' }
).addTo(map);

// Helper function to translate keys in layer control definitions
function translate(layerObject) {
  return Object.entries(layerObject).reduce((translated, [key, value]) => {
    translated[t[key]] = value;
    return translated;
  }, {});
}

// Grouped layer control
const baseLayers = translate({
  "OSM Standard style": osm,
  "OSM Humanitarian style": hot
})

// Configure the layer switcher
let groupedOverlays = {}
const groups = [...new Set(services.map(ser=>ser.group))]
for(const group of groups){
  groupedOverlays[group] = {}
}
for(const service of services){
  // make layers available in the global scope
  window[service.layers] = createWms(service)
  groupedOverlays[service.group][t[service.displayName]] = window[service.layers]
}
groupedOverlays = translate(groupedOverlays)

// Use the custom grouped layer control, not "L.control.layers"
L.control.groupedLayers(baseLayers, groupedOverlays, { position: 'topright', collapsed: false }).addTo(map);

// Prevent click/scroll events from propagating to the map through the layer control
const layerControlElement = $('.leaflet-control-layers')[0];
L.DomEvent.disableClickPropagation(layerControlElement);
L.DomEvent.disableScrollPropagation(layerControlElement);

map.addControl(new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    poly: {
      allowIntersection: false
    }
  },
  draw: {
    polygon: {
      showArea: true,
      fill: '#FFFFFF',
    },
    polyline: false,
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: true
  }
}));

//Measure tool
const options = {
  position : 'topleft',
  color : '#4a4747'
}
L.control.measure(options).addTo(map);

// Save drawed items in feature group
map.on(L.Draw.Event.CREATED, (event) => {
  drawnItems.addLayer(event.layer);
});

/* scale bar */
L.control.scale({ maxWidth: 300, position: 'bottomright' }).addTo(map);

// eslint-disable-next-line no-unused-vars
function refreshLayer(layer) {
  // Force reloading of the layer
  layer.setParams({ ts: Date.now() });
}

/**
 * create wms service based on serviceConf
 * @param {object} service config object from config.js
 */
function createWms(service) {
  return service.type === 'vector' ? L.tileLayer.betterWms(vectorWMS, service) : L.tileLayer.betterWms(rasterWMS, service)
}
// document.querySelector("#custom_print_button").addEventListener("click", function(){
//   var modeToUse = L.control.browserPrint.mode.auto();
//   map.printControl.print(modeToUse);
// });