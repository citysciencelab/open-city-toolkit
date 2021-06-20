import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'components';
import 'styles/style.css';
import { GlobalContextProvider } from './components/store/global';

const App = () => {
  return (
    <GlobalContextProvider>
      <Root />
    </GlobalContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
