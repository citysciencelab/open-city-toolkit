import React from 'react';
import PropTypes from 'prop-types';

import './styles/style.css';

export const ResultModal = ({ onCloseClicked }) => (
  <div id="results-modal" className="modal-background">
    <div className="modal-content">
      <div className="modal-header">
        <h4 className="modal-title">Previous results</h4>
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="all-btn" autoComplete="off" />
          <label className="btn btn-outline-primary" htmlFor="all-btn">All</label>
          <input type="radio" className="btn-check" name="btnradio" id="time-map-btn" autoComplete="off" />
          <label className="btn btn-outline-primary" htmlFor="time-map-btn">Time Map</label>
          <input type="radio" className="btn-check" name="btnradio" id="query-btn" autoComplete="off" />
          <label className="btn btn-outline-primary" htmlFor="query-btn">Query</label>
        </div>
        <button className="btn btn-danger btn-md" id="result-btn" onClick={() => { }}>Delete All</button>
        <button className="modal-close" onClick={onCloseClicked}>&times;</button>
      </div>
    </div>
  </div>
);

ResultModal.propTypes = {
  onCloseClicked: PropTypes.func.isRequired,
};