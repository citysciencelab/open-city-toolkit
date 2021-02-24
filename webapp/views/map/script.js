/* global L, osm, lat, lon, LayerControl */

const map = new L.Map('map', {
  center: new L.LatLng(lat, lon),
  zoom: 13,
  minZoom: 4,
  touchZoom: true
});

// osm base layer
osm.addTo(map)

// Drawings
const drawnItems = L.featureGroup().addTo(map);

// Control for map legends. For those item, where the linked map has a "legendYes: true," property, a second checkbox will displayed.
L.control.legend(
  { position: 'bottomleft' }
).addTo(map);

const layerControl = new LayerControl()
layerControl.initialize()

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

