import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './styles/style.css';

export const NavbarView = () => {
  return (
    <nav className="navbar navbar-expand navbar-light">
      <a className="navbar-brand fw-bold">Open City Toolkit</a>
      <ul className="navbar-nav flex-grow-1 justify-content-space-evenly">
        <li className="nav-item d-flex align-items-center">
          <span className="d-inline-block align-middle m-2">Modules</span>
          <select defaultValue="time_map" id="launch-module-menu" className="form-select form-select-lg me-2">
            <option value="time_map">Calculate time map</option>
            <option value="query">Query area</option>
          </select>
          <button className="btn btn-success btn-lg me-2" onClick={() => { }}>▷&nbsp;Run</button>
          <button className="btn btn-light btn-lg" id="result-btn" onClick={() => { }}>Results</button>
        </li>
        <li className="nav-item flex-grow-1"></li>
        <li className="nav-item d-flex align-items-center">
          {/* <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown link
            </a> */}
          <div className=" dropdown">

            <a className="btn btn-light btn-lg dropdown-toggle" id="settings-menu" role="button" data-bs-toggle="dropdown">Settings</a>
            <ul className="dropdown-menu" aria-labelledby="settings-menu">
              <li>
                <a className="btn dropdown-item" onClick={() => { }}>Set basemap</a>
              </li>
              <li>
                <a className="btn dropdown-item" onClick={() => { }}>Set Selection</a>
              </li>
              <li>
                <a className="btn dropdown-item" onClick={() => { }}>Set resolution</a>
              </li>
              <li>
                <a className="btn dropdown-item" onClick={() => { }}>Add layer</a>
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <a className="btn btn-secondary btn-lg" href="https://github.com/citysciencelab/open-city-toolkit/wiki" target="_blank">
            Help
          </a>
        </li>
      </ul>
    </nav >
  );
};
