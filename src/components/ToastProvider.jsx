import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          fontSize: '14px',
          padding: '12px 20px',
        },
        success: {
          style: {
            borderLeft: '4px solid #00BFFF', // Neon Blue
          },
          iconTheme: {
            primary: '#00BFFF',
            secondary: '#1a1a1a',
          },
        },
        error: {
          style: {
            borderLeft: '4px solid #FF4500', // Red-Orange
          },
          iconTheme: {
            primary: '#FF4500',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
