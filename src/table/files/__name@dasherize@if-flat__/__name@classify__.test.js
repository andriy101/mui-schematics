import React from 'react';
import ReactDOM from 'react-dom';
import <%= classify(name) %> from './<%= classify(name) %>';

it('<%= classify(name) %> component renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<<%= classify(name) %> />, div);
  ReactDOM.unmountComponentAtNode(div);
});