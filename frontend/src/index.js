import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SongProvider } from './context/SongContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SongProvider>
    <App />
    </SongProvider>
  </React.StrictMode>
);

