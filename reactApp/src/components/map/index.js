import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-groupedlayercontrol';
import 'leaflet/dist/leaflet.css';
import './styles/style.css';

export const MapView = () => {

  useEffect(() => {
    const map = new L.Map('map', {
      center: new L.LatLng(
        process.env.LATITUDE,
        process.env.LONGITUDE
      ),
      zoom: 13,
      minZoom: 4,
      touchZoom: true
    });

    /* Create background maps */
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const hot = L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; Humanitarian map style by <a href="https://www.hotosm.org/">HOT</a>'
    });

    /* Set up grouped layer control */
    const baseLayers = {
      "OSM Standard style": osm,
      "OSM Humanitarian style": hot
    };

    L.control.groupedLayers(baseLayers, {}, { position: 'topright', collapsed: false }).addTo(map);

    /* Scale bar */
    L.control.scale({ maxWidth: 300, position: 'bottomright' }).addTo(map);

  }, []);

  return (
    <div id="map"></div>
  );
};
