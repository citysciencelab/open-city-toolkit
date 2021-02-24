/* global L, t, layerControl */

// Author: FARKAS Gábor,
// University of Pécs, Hungary
// 2020, 2 July,

// Hacking layer controlt, to create a 2nd checkboxot too.
const layerAddOrigFunc = L.Control.GroupedLayers.prototype._addItem;
const LEGEND_QUERY = '?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER='
const RASTER_QUERY = '&LEGEND_OPTIONS=forceRule:True;dx:0.2;dy:0.2;mx:0.2;my:0.2;fontStyle:bold;borderColor:0000ff;border:true;fontSize:10'
L.Control.GroupedLayers.prototype._addItem = function (obj) {
  // The original functionality -- of course -- preserved and called :)
  const label = layerAddOrigFunc.call(this, obj);
  // Only for WMS -- otherwise it has no sense.
  if (obj.layer instanceof L.TileLayer.WMS && obj.layer.options.legend) {
    label.children[0].addEventListener('click', handleLegendClick.bind(obj.layer));
  }
  return label;
}

// Legend control -- the previous link will binded to
L.Control.Legend = L.Control.extend({
  // This will run when adding to the map.
  onAdd: function () {
    // This is a base div, containing the legends
    const container = L.DomUtil.create('div'),
      content = L.DomUtil.create('div'),
      title = L.DomUtil.create('span')

    title.id = 'leaflet-legend-title'
    title.innerHTML = t['Map legend']
    container.id = 'leaflet-legend-container'
    content.id = 'leaflet-legend-content'
    container.className = 'leaflet-legend'
    container.appendChild(title)
    container.appendChild(content)
    return container;
  },

  // It is not necessary to remove, it would be pointless
  onRemove: function () { }
});

// A comfot function in Leaflet style
L.control.legend = function (opts) {
  return new L.Control.Legend(opts);
}

// Actual linking to  'legend control'. The 'this' contains the layer, and the 'evt.target' contains the checkbox.
function handleLegendClick(evt) {

  const content = document.getElementById('leaflet-legend-content');
  if (evt.target.checked) {
    const div = L.DomUtil.create('div')
    div.id = this.wmsParams.layers
    div.className = 'leaflet-legend-item'
    content.appendChild(div)

    const p = L.DomUtil.create('p')
    p.className = 'leaflet-legend-layer-name'
    p.innerHTML = layerControl.services.filter(ser => ser.layers === this.options.layers)[0].displayName
    div.appendChild(p)

    const img = L.DomUtil.create('img')
    img.style = 'display:block;'
    img.src = this._url + LEGEND_QUERY + this.wmsParams.layers
    // add LEGEND_OPTIONS for raster legends
    img.src += img.src.split('/')[4] === 'raster' ? RASTER_QUERY : ''
    div.appendChild(img)
  } else {
    const img = document.getElementById(this.wmsParams.layers);
    if (img && content.contains(img)) {
      content.removeChild(img);
    }
  }
}
