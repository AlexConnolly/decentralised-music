import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { TrackProvider } from './providers/TrackContext';
import { ModalManagerProvider } from './components/core/modal/ModalManagerProvider';
import "cal-sans";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ModalManagerProvider>
  <TrackProvider>
        <App />
    </TrackProvider>
  </ModalManagerProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
