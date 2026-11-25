import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/home.css';
import './styles/products.css';
import './styles/auth.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
