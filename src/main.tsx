import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { PreferencesProvider } from './hooks/usePreferences';
import { AuthScreen } from './components/Auth/AuthScreen';
import { usePreferences } from './hooks/usePreferences';
import { copy } from './utils/copy';
import './styles/globals.css';

function Gate() {
  const { user, isLoading } = useAuth();
  const { t } = usePreferences();

  if (isLoading) {
    return <div className="app-loading">{t(copy.loading)}</div>;
  }

  return user ? <App /> : <AuthScreen />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <PreferencesProvider>
        <Gate />
      </PreferencesProvider>
    </AuthProvider>
  </React.StrictMode>
);
