import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/style.css';
import { GlobalContext } from '../../store/global';

export const SidebarView = () => {
  const { activeModule } = React.useContext(GlobalContext);

  return (
    <>
      <div id="dialog" className="flex-grow-1 card card-border box-shadow">
        {activeModule && React.createElement(activeModule)}
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
