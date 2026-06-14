import React from 'react';
import { X, Mail, Phone, ShoppingBag, Send, AlertTriangle } from 'lucide-react';
import { Customer } from '../../types/customer';
import { formatCurrency } from '../../utils/format';
import { formatDateTime } from '../../utils/date';
import StatusBadge from '../campaign/StatusBadge';

interface CustomerDrawerProps {
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary">{customer.name}</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Customer ID: {customer.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border hover:border-border-strong text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Contact Details */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Contact Info</span>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center space-x-2.5 bg-background border border-border p-2.5 rounded-lg">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-text-secondary">{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-background border border-border p-2.5 rounded-lg">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-text-secondary font-mono">{customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Segment Profiles */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Assigned Segment Profiles</span>
              <div className="flex flex-wrap gap-1.5">
                {customer.segments.map((seg, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded text-[10px] font-bold border capitalize tracking-wide select-none bg-primary/10 text-primary border-primary/25"
                  >
                    {seg}
                  </span>
                ))}
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Order Ledger</span>
                <span className="text-[10px] text-accent-emerald font-bold">{formatCurrency(customer.totalSpend)} spent</span>
              </div>

              {!customer.orders || customer.orders.length === 0 ? (
                <div className="bg-background border border-border p-4 rounded-lg text-center text-xs text-text-secondary">
                  <ShoppingBag className="w-5 h-5 text-text-muted mx-auto mb-1.5" />
                  <span>No orders in history ledger</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {customer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="flex items-center justify-between text-xs bg-background border border-border p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-text-primary">Order #{ord.id.substring(0, 8)}</p>
                        <p className="text-[9px] text-text-muted mt-0.5">{formatDateTime(ord.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent-emerald">{formatCurrency(ord.amount)}</p>
                        <span className="text-[9px] uppercase font-bold text-text-secondary">{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Marketing Campaign Touchpoint History */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Marketing Touchpoints</span>

              {!customer.campaignHistory || customer.campaignHistory.length === 0 ? (
                <div className="bg-background border border-border p-4 rounded-lg text-center text-xs text-text-secondary">
                  <Send className="w-5 h-5 text-text-muted mx-auto mb-1.5" />
                  <span>No campaign dispatches on record</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {customer.campaignHistory.map((hist, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-background border border-border p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-text-primary">{hist.campaignName}</p>
                        <p className="text-[9px] text-text-muted mt-0.5">Updated: {formatDateTime(hist.updatedAt)}</p>
                      </div>
                      <StatusBadge status={hist.status} type="recipient" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerDrawer;
