import './index.css';
import { App } from './App.js';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    App(root);
  } else {
    console.error('Root element not found');
  }
});
