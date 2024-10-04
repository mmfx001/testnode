// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Optional: You can use React.StrictMode for highlighting potential problems
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
