import React from 'react';
import StatusCards from '../components/dashboard/StatusCard';
import CurtainLiveView from '../components/dashboard/CurtainLiveView';
import ControlPanel from '../components/dashboard/ControlPanel';
import ModeSelector from '../components/dashboard/ModeSelector';
import QuickPresets from '../components/dashboard/QuickPreset';
import SensorCard from '../components/dashboard/SensorCard';

export const DashboardPage = ({ setActivePage }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Row 1: Four Status Cards */}
      <section aria-label="Status Overview">
        <StatusCards />
      </section>

      {/* Row 2: Live View & Control Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" aria-label="Live Curtain & Control">
        {/* Left: Interactive Live View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <CurtainLiveView />
        </div>

        {/* Right: Tactile Control Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <ControlPanel />
        </div>
      </section>

      {/* Row 3: Operation Mode & Quick Presets */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" aria-label="Modes and Presets">
        <div className="lg:col-span-5">
          <ModeSelector />
        </div>
        <div className="lg:col-span-7">
          <QuickPresets />
        </div>
      </section>

      {/* Row 4: Sensor Data Overview */}
      <section aria-label="Sensor Telemetry Overview">
        <SensorCard onNavigateToSensors={() => setActivePage('sensors')} />
      </section>
    </div>
  );
};

export default DashboardPage;
