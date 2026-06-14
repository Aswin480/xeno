import React from 'react';
import { Customer } from '../../types/customer';
import { formatCurrency } from '../../utils/format';
import { Eye } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  onRowClick: (id: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onRowClick }) => {
  const getSegmentBadgeStyle = (segment: string) => {
    switch (segment.toUpperCase()) {
      case 'VIP':
        return 'bg-gold/10 text-gold border-gold/25';
      case 'CART ABANDONER':
        return 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25';
      case 'INACTIVE':
        return 'bg-accent-rose/10 text-accent-rose border-accent-rose/25';
      default:
        return 'bg-secondary text-text-secondary border-border';
    }
  };

  if (customers.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm font-semibold text-text-primary">No customers found</p>
        <p className="text-xs text-text-secondary mt-1">Try adjusting your search queries or segment filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-[10px] uppercase font-bold text-text-muted tracking-wider">
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Segment Profiles</th>
              <th className="px-6 py-4 text-right">Orders Count</th>
              <th className="px-6 py-4 text-right text-accent-emerald">Total Spend</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {customers.map((cust) => (
              <tr
                key={cust.id}
                onClick={() => onRowClick(cust.id)}
                className="hover:bg-primary/5 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {cust.name}
                </td>
                <td className="px-6 py-4 text-text-secondary">{cust.email}</td>
                <td className="px-6 py-4 text-text-muted font-mono">{cust.phone}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {cust.segments.map((seg, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border capitalize tracking-wide select-none ${getSegmentBadgeStyle(seg)}`}
                      >
                        {seg}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-text-primary">
                  {cust.ordersCount}
                </td>
                <td className="px-6 py-4 text-right font-bold text-accent-emerald">
                  {formatCurrency(cust.totalSpend)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(cust.id);
                    }}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-background border border-border hover:border-primary/30 hover:bg-primary/5 text-text-secondary hover:text-primary rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CustomerTable;
