import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CurtainProvider } from './context/CurtainContext';
import ToastContainer from './components/common/ToastContainer';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import MobileNav from './components/common/MobileNav';
import BleModal from './components/ble/BleModal';

// Pages
import DashboardPage from './pages/DashboardPage';
import ControlPage from './pages/ControlPage';
import AutomationPage from './pages/AutomationPage';
import SensorDataPage from './pages/SensorDataPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bleModalOpen, setBleModalOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'control':
        return <ControlPage />;
      case 'automation':
        return <AutomationPage />;
      case 'sensors':
        return <SensorDataPage />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenBleModal={() => setBleModalOpen(true)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {renderActivePage()}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav activePage={activePage} setActivePage={setActivePage} />
      </div>

      {/* Modal Dialogs & Toasts */}
      <BleModal isOpen={bleModalOpen} onClose={() => setBleModalOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <CurtainProvider>
        <AppContent />
      </CurtainProvider>
    </ToastProvider>
  );
}

export default App;
