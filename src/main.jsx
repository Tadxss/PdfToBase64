import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PdfConverter from './components/PdfConverter.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <PdfConverter />
    </ErrorBoundary>
  </StrictMode>
);
