import React from 'react';
import SidebarItem from './SidebarItem';
import { Sparkles, History, Activity, TrendingUp, Users } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-border bg-card/40 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border space-x-3">
        <img src="/logo.svg" alt="Xeno Logo" className="w-8 h-8" />
        <span className="text-lg font-bold text-gradient">Xeno Copilot</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <SidebarItem to="/" icon={Sparkles} label="Copilot Home" />
        <SidebarItem to="/campaigns" icon={History} label="Campaign History" />
        <SidebarItem to="/insights" icon={TrendingUp} label="Insights Dashboard" />
        <SidebarItem to="/customers" icon={Users} label="Customer Directory" />
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border bg-card/60">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">Xeno AI Hub</p>
            <p className="text-[10px] text-text-muted">Agentic Co-Marketing</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
