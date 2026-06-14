import React from 'react';
import { Search } from 'lucide-react';

interface CustomerSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-text-secondary" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search customers by name, email or phone..."
        className="block w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-text-primary placeholder-text-muted text-xs focus:outline-none focus:border-primary/45 focus:ring-1 focus:ring-primary/20 transition-all"
      />
    </div>
  );
};
export default CustomerSearch;
