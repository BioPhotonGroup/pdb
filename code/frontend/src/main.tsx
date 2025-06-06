import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes/app-routes';
import './assets/styles/main.scss';

// Get the root DOM element
const container = document.getElementById('root');

// Ensure the container exists and create the root for React 18
if (container) {
  const root = createRoot(container);
  root.render(<AppRoutes />);
}