import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthScreen } from './components/Auth/AuthScreen';
import { bilingualText, copy } from './utils/copy';
import './styles/globals.css';

function Gate() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="app-loading">{bilingualText(copy.loading)}</div>;
  }

  return user ? <App /> : <AuthScreen />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Gate />
    </AuthProvider>
  </React.StrictMode>
);
