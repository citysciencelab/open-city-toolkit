/* global staticServices, $, L, t, geoserverUrl, map, get */
const rasterWMS = geoserverUrl + 'geoserver/raster/wms';
const vectorWMS = geoserverUrl + 'geoserver/vector/wms';

// Background map
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const hot = L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; Humanitarian map style by <a href="https://www.hotosm.org/">HOT</a>'
});

// Grouped layer control
const baseLayers = translate({
  "OSM Standard style": osm,
  "OSM Humanitarian style": hot
})

// eslint-disable-next-line no-unused-vars
class LayerControl {
  constructor() {
    this.services = null
  }
  /**
   * Initialize this layer control and renders it to the DOM
   */
  initialize() {
    get('/upload-layers', {},
      (res) => new Promise((resolve) => {
        resolve(res);
      })
        .then(res => {
          this.services = [...staticServices]

          res.forEach(layer => {
            this.services.push({
              layers: layer,
              format: 'image/png',
              transparent: true,
              maxZoom: 20,
              minZoom: 1,
              legend: true,
              displayName: layer,
              type: 'vector',
              group: 'Custom layers'
            })
          })
          const groupedOverlays = this.configure(this.services)
          this.render(groupedOverlays)
        })
    )
  }

  /**
   * create groupedOverlays
   * @param {object} config service config for groupedOverlays
   */
  configure(config) {
    let groupedOverlays = {}
    const groups = [...new Set(config.map(ser => ser.group))]
    for (const group of groups) {
      groupedOverlays[group] = {}
    }
    for (const service of config) {
      // make layers available in the global scope
      window[service.layers] = createWms(service)
      // use displayName in config if no translation is provided
      if (t[service.displayName] !== undefined) {
        groupedOverlays[service.group][t[service.displayName]] = window[service.layers]
      } else {
        groupedOverlays[service.group][service.displayName] = window[service.layers]
      }
    }
    groupedOverlays = translate(groupedOverlays)
    return groupedOverlays
  }

  /**
   * renders layer switcher
   * @param {object} groupedOverlays layer switcher configuration
   */
  // eslint-disable-next-line no-unused-vars
  render(groupedOverlays) {
    if ($('.leaflet-control-layers').length) {
      $('.leaflet-control-layers')[0].remove()
    }
    L.control.groupedLayers(baseLayers, groupedOverlays, { position: 'topright', collapsed: false }).addTo(map);

    // Prevent click/scroll events from propagating to the map through the layer control
    const layerControlElement = $('.leaflet-control-layers')[0];
    L.DomEvent.disableClickPropagation(layerControlElement);
    L.DomEvent.disableScrollPropagation(layerControlElement);
  }
}

/**
 * create wms service based on serviceConf
 * @param {object} service config object from config.js
 */
function createWms(service) {
  return service.type === 'vector' ? L.tileLayer.wms(vectorWMS, service) : L.tileLayer.wms(rasterWMS, service)
}

// Helper function to translate keys in layer control definitions
function translate(layerObject) {
  return Object.entries(layerObject).reduce((translated, [key, value]) => {
    // use group name in config if no translation is provided
    if (t[key] !== undefined) {
      translated[t[key]] = value;
    } else {
      translated[key] = value;
    }
    return translated;
  }, {});
}