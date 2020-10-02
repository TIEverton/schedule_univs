import React from 'react';
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./hooks";

import Routes from './routes';
import './assets/styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;