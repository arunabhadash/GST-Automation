import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import GstAutomationHub from './pages/GstAutomationHub';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';

export type Screen = 'Dashboard' | 'GST Automation' | 'Analytics' | 'Integrations';
type AppState = 'landing' | 'onboarding' | 'main';


function App(): React.ReactNode {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeScreen, setActiveScreen] = useState<Screen>('Dashboard');

  if (appState === 'landing') {
    return <LandingPage onEnter={() => setAppState('onboarding')} onSkip={() => setAppState('main')} />;
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={() => setAppState('main')} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Dashboard':
        return <Dashboard setActiveScreen={setActiveScreen} />;
      case 'GST Automation':
        return <GstAutomationHub />;
      case 'Analytics':
        return <Analytics />;
      case 'Integrations':
        return <Integrations />;
      default:
        return <div className="p-8"><h2 className="text-3xl font-bold text-charcoal tracking-tight">Coming Soon: {activeScreen}</h2></div>;
    }
  };

  return (
    <div className="flex h-screen bg-white text-charcoal">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#ffffff',
          color: '#121212',
          border: '1px solid #e5e7eb',
          borderRadius: '0.25rem',
          boxShadow: 'none',
        },
      }}/>
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderScreen()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;