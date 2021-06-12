import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'components';
import 'styles/style.css';

const App = () => {
  return (
    <Root />
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
