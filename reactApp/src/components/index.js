import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { MapView } from './map';
import { NavbarView } from './navbar';
import { SidebarView } from './sidebar';

import './styles/style.css';

export const Root = () => {
  return (
    <div className="d-flex flex-column h-100">
      <div className="card box-shadow">
        <NavbarView />
      </div>
      <div className="d-flex flex-grow-1 main">
        <div id="sidebar" className="d-flex flex-column sidebar">
          <SidebarView />
        </div>
        <div id="map-container" className="col card box-shadow">
          <MapView />
        </div>
      </div>
    </div>
  );
}
