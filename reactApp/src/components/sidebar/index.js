import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/style.css';
import { GlobalContext } from '../store/global';

export const SidebarView = () => {
  const { dialogMessage, WPS } = React.useContext(GlobalContext);
  const basemapForm = React.createRef();

  const submitBasemap = () => {
    const formData = new FormData(basemapForm.current);

    fetch(`http://localhost:5000/upload`, {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(response => {
        WPS.Execute('set_basemap', `filename=${response}`)
          .then(() => {
            console.log("OK");
          })
          .catch(err => {
            console.error(err.message);
          });
      })
      .catch(err => {
        console.error(err.message);
      });
  };

  return (
    <>
      <div id="dialog" className="flex-grow-1 card card-border box-shadow">
        <div id="textarea" >
          {dialogMessage}
          <form ref={basemapForm} encType="multipart/form-data">
            <input type="file" name="file" />
          </form>
        </div>
        <div id="lists"></div>
        <div id="buttonarea" className="btn-group">
          <button type="button" className="btn btn-primary" onClick={submitBasemap}>Submit</button>
        </div>
      </div>
      <div className="card flex-row justify-content-center">
        <div className="d-block">
          <img alt="GIZ logo" id="giz-logo" src="assets/images/giz-logo.gif" />
          <img alt="HCU logo" id="hcu-logo" src="assets/images/hcu-logo.png" />
        </div>
      </div>
    </>
  );
};
