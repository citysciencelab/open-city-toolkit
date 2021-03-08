/* global L, t */

L.Control.Legend = L.Control.extend({
  onAdd: function () {
    const container = L.DomUtil.create('div'),
      content = L.DomUtil.create('div'),
      title = L.DomUtil.create('span');

    title.id = 'leaflet-legend-title';
    title.innerHTML = t['Map legend'];
    container.id = 'leaflet-legend-container';
    content.id = 'leaflet-legend-content';
    container.className = 'leaflet-legend';
    container.appendChild(title);
    container.appendChild(content);
    return container;
  },

  toggleLegendForLayer: function (checked, layer) {
    const content = L.DomUtil.get('leaflet-legend-content');
    const elementID = 'legend_' + layer.wmsParams.layers;

    if (checked) {
      const div = L.DomUtil.create('div');
      div.id = elementID;
      div.className = 'leaflet-legend-item';

      const p = L.DomUtil.create('p');
      p.className = 'leaflet-legend-layer-name';
      p.innerHTML = layer.options.displayName;

      const img = L.DomUtil.create('img');

      // build legend URL
      img.src = layer._url + '?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + layer.wmsParams.layers + '&STYLE=' + layer.wmsParams.styles;
      if (layer.options.type === 'raster') {
        img.src += '&LEGEND_OPTIONS=forceRule:True;dx:0.2;dy:0.2;mx:0.2;my:0.2;fontStyle:bold;borderColor:0000ff;border:true;fontSize:10';
      }

      div.appendChild(p);
      div.appendChild(img);
      content.appendChild(div);
    }
    else {
      const img = L.DomUtil.get(elementID);

      if (img && content.contains(img)) {
        content.removeChild(img);
      }
    }
  }
});

L.control.legend = function (opts) {
  return new L.Control.Legend(opts);
}
