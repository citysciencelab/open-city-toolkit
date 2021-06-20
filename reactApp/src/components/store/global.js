import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

export const GlobalContext = React.createContext();

const initialState = {
  dialogMessage: '',
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
