import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback="loading">
        <ThemeProvider>
          <AuthProvider> {/* Wrap App with AuthProvider */}
            <SocketProvider>
              <App />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
