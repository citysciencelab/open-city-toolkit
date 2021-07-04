import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import { parseWPSResponse } from './utils';

const baseURL = "http://localhost:5000/wps?service=WPS&version=1.0.0&request=Execute&"; // will be moved to .env in following iteration
export const GlobalContext = React.createContext();

const initialState = {
  dialogMessage: '',
  fetchWPS: (identifier, dataInputs) => {
    return fetch(`${baseURL}identifier=${identifier}&dataInputs=${dataInputs}`)
      .then(response => parseWPSResponse(response));
  }
};
const actions = {
  SET_DIALOG_MESSAGE: 'SET_DIALOG_MESSAGE',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DIALOG_MESSAGE':
      return { ...state, dialogMessage: action.value };
    default:
      return state;
  }
};

export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    dialogMessage: state.dialogMessage,
    fetchWPS: state.fetchWPS,
    setDialogMessage: (value) => {
      dispatch({ type: actions.SET_DIALOG_MESSAGE, value });
    },
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

GlobalContextProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
