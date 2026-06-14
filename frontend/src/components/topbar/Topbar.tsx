import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Cpu, Terminal, Shield, Sun, Moon } from 'lucide-react';
import { api, simulatorApi } from '../../api/axios';
import { getTheme, setTheme } from '../../utils/theme';

export const Topbar: React.FC = () => {
  const location = useLocation();
  const [crmStatus, setCrmStatus] = useState<'online' | 'offline'>('offline');
  const [simulatorStatus, setSimulatorStatus] = useState<'online' | 'offline'>('offline');
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => getTheme());

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    setThemeState(nextTheme);
  };

  // Determine page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'AI Copilot Center';
    if (path.startsWith('/campaigns/review')) return 'Campaign Launchpad';
    if (path.startsWith('/campaigns/monitor')) return 'Live Delivery Monitor';
    if (path === '/campaigns') return 'Campaign Registry';
    if (path === '/insights') return 'Performance Analytics';
    if (path === '/customers') return 'Customer Directory';
    return 'Xeno Command Center';
  };

  useEffect(() => {
    // Probe service statuses on load
    const checkHealth = async () => {
      try {
        await api.get('/insights'); // lightweight endpoint
        setCrmStatus('online');
      } catch {
        setCrmStatus('offline');
      }

      try {
        // Send a request to simulator, expect 404/400 (which means it's online and listening)
        await simulatorApi.post('/send', {});
        setSimulatorStatus('online');
      } catch (err: any) {
        if (err.response) {
          // If the server answered (even with error status), it is online
          setSimulatorStatus('online');
        } else {
          setSimulatorStatus('offline');
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur-xl flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-20">
      <h1 className="text-lg font-semibold text-text-primary tracking-wide">{getPageTitle()}</h1>

      {/* Service Connections Indicators */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-background/60 border border-border px-3 py-1.5 rounded-lg text-xs">
          <Cpu className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-text-secondary font-medium">CRM Backend:</span>
          <div className="flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${crmStatus === 'online' ? 'bg-accent-emerald shadow-[0_0_8px_#10b981]' : 'bg-accent-rose'}`}></span>
            <span className="text-[10px] uppercase font-bold text-text-muted">{crmStatus}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-background/60 border border-border px-3 py-1.5 rounded-lg text-xs">
          <Terminal className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-text-secondary font-medium">Simulator:</span>
          <div className="flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${simulatorStatus === 'online' ? 'bg-accent-emerald shadow-[0_0_8px_#10b981]' : 'bg-accent-rose'}`}></span>
            <span className="text-[10px] uppercase font-bold text-text-muted">{simulatorStatus}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-background/60 border border-border px-3 py-1.5 rounded-lg text-xs">
          <Shield className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-text-secondary font-medium">Secure:</span>
          <span className="text-[10px] uppercase font-bold text-accent-cyan">Auto</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg border border-border bg-background/60 hover:bg-primary/10 hover:border-primary/30 text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
export default Topbar;
