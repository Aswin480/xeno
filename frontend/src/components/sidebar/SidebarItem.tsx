import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
          isActive
            ? 'bg-primary/10 border-primary/20 text-primary font-semibold'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-primary/5'
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
};
export default SidebarItem;
