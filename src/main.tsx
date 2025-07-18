import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { Analytics } from '@vercel/analytics/react'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ChatProvider>
          <App />
          <Analytics /> 
        </ChatProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);