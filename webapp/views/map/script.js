/* global $, L, t, lat, lon, geoserverUrl, layers */


const map = new L.Map('map', {
  center: new L.LatLng(lat, lon),
  zoom: 13,
  minZoom: 4,
  touchZoom: true
});

const rasterWMS = geoserverUrl + 'geoserver/raster/wms';
const vectorWMS = geoserverUrl + 'geoserver/vector/wms';


/* Create background maps */

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const hot = L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; Humanitarian map style by <a href="https://www.hotosm.org/">HOT</a>'
});


/* Set up grouped layer control */

const baseLayers = translate({
  "OSM Standard style": osm,
  "OSM Humanitarian style": hot
});

let groupedOverlays = {}
const groups = [...new Set(layers.map(layer => layer.group))]
for (const group of groups) {
  groupedOverlays[group] = {};
}
for (const layer of layers) {
  // make layers available in the global scope
  window[layer.layers] = createWms(layer);
  groupedOverlays[layer.group][t[layer.displayName]] = window[layer.layers];
}
groupedOverlays = translate(groupedOverlays);

const layerAddOrigFunc = L.Control.GroupedLayers.prototype._addItem;

// Before adding items, tweak the GroupedLayers control so it adds event listeners activating the legend
L.Control.GroupedLayers.prototype._addItem = function (obj) {
  const label = layerAddOrigFunc.call(this, obj);

  if (obj.layer instanceof L.TileLayer.WMS && obj.layer.options.legend) {
    $(label).find('input').on('click', evt => {
      map.legend.toggleLegendForLayer(evt.target.checked, obj.layer);
    });
  }
  return label;
};

L.control.groupedLayers(baseLayers, groupedOverlays, { position: 'topright', collapsed: false }).addTo(map);

// Prevent click/scroll events from propagating to the map through the layer control
const layerControlElement = $('.leaflet-control-layers')[0];
L.DomEvent.disableClickPropagation(layerControlElement);
L.DomEvent.disableScrollPropagation(layerControlElement);


/* Map legend */

map.legend = L.control.legend(
  { position: 'bottomleft' }
).addTo(map);


/* Drawing tool */

const drawnItems = L.featureGroup().addTo(map);

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

// Save drawn items in feature group
map.on(L.Draw.Event.CREATED, event => {
  drawnItems.addLayer(event.layer);
});

// Disable getFeatureInfo while drawing is in process
map.on(L.Draw.Event.DRAWSTART, () => {
  layers.filter(layer => window[layer.layers] instanceof L.TileLayer.BetterWMS).forEach(layer => {
    window[layer.layers].getFeatureInfoDisabled = true;
  });
});
map.on(L.Draw.Event.DRAWSTOP, () => {
  layers.filter(layer => window[layer.layers] instanceof L.TileLayer.BetterWMS).forEach(layer => {
    window[layer.layers].getFeatureInfoDisabled = false;
  });
});


/* Measure tool */

L.control.measure({
  position : 'topleft',
  primaryLengthUnit: 'kilometers',
  primaryAreaUnit: 'sqkilometers',
  secondaryLengthUnit: 'miles',
  secondaryAreaUnit: 'sqmiles',
  units: {
    sqkilometers: {factor: 1e-6, display: 'km²', decimals: 2},
  },
  activeColor: '#1e90ff',
  completedColor: '#1e90ff'
}).addTo(map);


/* Scale bar */

L.control.scale({ maxWidth: 300, position: 'bottomright' }).addTo(map);


/* Helper functions */

/**
 * Force-refresh a map layer
 * @param {object} layer layer from config.js
 */
// eslint-disable-next-line no-unused-vars
function refreshLayer(layer) {
  layer.setParams({ ts: Date.now() });
}

/**
 * Translate keys in layer control definitions
 * @param {object} layer layer from config.js
 */
function translate(layer) {
  return Object.entries(layer).reduce((translated, [key, value]) => {
    translated[t[key]] = value;
    return translated;
  }, {});
}

/**
 * Create WMS service based on layer config
 * @param {object} layer layer from config.js
 */
function createWms(layer) {
  if (layer.type === 'vector') {
    return (layer.getFeatureInfo ? L.tileLayer.betterWms : L.tileLayer.wms)(vectorWMS, layer);
  }
  if (layer.type === 'raster') {
    return L.tileLayer.wms(rasterWMS, layer);
  }
}
