import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  Sparkles, 
  Activity, 
  Settings, 
  Info, 
  Blinds,
  CheckCircle2,
  X
} from 'lucide-react';

export const Sidebar = ({ activePage, setActivePage, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'control', label: 'Control', icon: Sliders },
    { id: 'automation', label: 'Automation', icon: Sparkles },
    { id: 'sensors', label: 'Sensor Data', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-navy-900 text-slate-200 flex flex-col border-r border-slate-800/80 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/20">
              <Blinds className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Smart Curtain
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Control Your Comfort
              </p>
            </div>
          </div>
          {/* Mobile close button */}
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`} 
                />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-4 bg-white/70 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Widget */}
        <div className="p-4 border-t border-slate-800/80 bg-navy-950/60">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Control System:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                System Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Direct tactile curtain controls and smart presets.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
