import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { TrackProvider } from './providers/TrackContext';
import { ModalManagerProvider } from './components/core/modal/ModalManagerProvider';
import "cal-sans";
import { DownloadProvider } from './providers/DownloadContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ModalManagerProvider>
    <DownloadProvider>
      <TrackProvider>
            <App />
        </TrackProvider>
    </DownloadProvider>
  </ModalManagerProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
