import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import {
  ArrowLeft,
  Mail,
  Phone,
  ShoppingBag,
  Send,
  Loader2,
  Calendar,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Tag,
  Crown
} from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { formatDateTime } from '../utils/date';
import StatusBadge from '../components/campaign/StatusBadge';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCustomer: customer, loading, error, fetchCustomerById } = useCustomers();

  useEffect(() => {
    if (id) {
      fetchCustomerById(id);
    }
  }, [id, fetchCustomerById]);

  if (loading && !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-text-secondary">Retrieving full customer ledger & history...</p>
      </div>
    );
  }

  if (error || (!customer && !loading)) {
    return (
      <div className="space-y-6 pt-6">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center space-x-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
        <div className="bg-accent-rose/10 border border-accent-rose/25 p-5 rounded-xl text-sm text-accent-rose space-y-2">
          <p className="font-bold">Error loading profile</p>
          <p>{error || 'Customer record not found.'}</p>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  // Helpers
  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const avgOrderValue = customer.ordersCount > 0 ? customer.totalSpend / customer.ordersCount : 0;

  // VIP segment checks
  const isVip = customer.segments.some((s) => s.toUpperCase() === 'VIP');
  const isCartAbandoner = customer.segments.some((s) => s.toUpperCase() === 'CART ABANDONER');
  const isInactive = customer.segments.some((s) => s.toUpperCase() === 'INACTIVE');

  // Customer status text
  let statusText = 'Active Subscriber';
  let statusColor = 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20';
  if (isInactive) {
    statusText = 'Dormant User';
    statusColor = 'text-accent-rose bg-accent-rose/10 border-accent-rose/20';
  } else if (isVip) {
    statusText = 'Premium VIP Tier';
    statusColor = 'text-gold bg-gold/10 border-gold/25';
  }

  return (
    <div className="space-y-6 pt-6">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center space-x-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Customer Directory</span>
        </button>
        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${
          isVip 
            ? 'bg-gold/5 text-gold border-gold/30' 
            : 'bg-card text-text-muted border-border'
        }`}>
          ID: {customer.id}
        </span>
      </div>

      {/* 2. Profile Glass Header */}
      <div className={`border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-6 shadow-md relative overflow-hidden transition-all duration-300 ${
        isVip 
          ? 'bg-gradient-to-r from-gold/10 via-card to-background border-gold/35 shadow-[0_4px_30px_rgba(212,175,55,0.05)]' 
          : 'bg-card border-border'
      }`}>
        {/* Glow decoration */}
        {isVip ? (
          <>
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          </>
        ) : (
          <>
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
          </>
        )}

        {/* Initials Circle */}
        <div className="relative flex-shrink-0 flex items-center">
          {isVip ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/60 to-gold-dark rounded-full blur-md opacity-40 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full bg-background border border-gold/40 flex items-center justify-center text-3xl font-extrabold text-gold tracking-wider">
                {initials}
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gold to-gold-light p-1.5 rounded-full border border-background shadow-md">
                  <Crown className="w-3.5 h-3.5 text-stone-950 animate-bounce" />
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent-cyan rounded-full blur-md opacity-30 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full bg-background border border-primary/20 flex items-center justify-center text-3xl font-extrabold text-primary tracking-wider">
                {initials}
              </div>
            </>
          )}
        </div>

        {/* Profile Meta info */}
        <div className="flex-1 flex flex-col justify-between text-center md:text-left space-y-4 md:space-y-0">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center justify-center md:justify-start space-x-2">
                <span>{customer.name}</span>
                {isVip && <Crown className="w-5 h-5 text-gold fill-gold/20" />}
              </h1>
              {isVip ? (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-gold/15 to-gold-light/10 border border-gold/45 text-[10px] font-black uppercase tracking-wider text-gold flex items-center space-x-1 shadow-[0_0_10px_rgba(212,175,55,0.1)] self-center md:self-auto">
                  <Crown className="w-3 h-3 text-gold" />
                  <span>Premium VIP Member</span>
                </span>
              ) : (
                <span className={`px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider self-center md:self-auto ${statusColor}`}>
                  {statusText}
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary flex flex-wrap items-center justify-center md:justify-start gap-1">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span>Customer profile logged:</span>
              <span className="font-semibold text-text-primary">{formatDateTime(customer.createdAt)}</span>
            </p>
          </div>

          {/* Sub-contacts & Tags row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs pt-2">
            <div className={`flex items-center justify-center md:justify-start space-x-2 bg-background border p-2.5 rounded-xl ${
              isVip ? 'border-gold/20' : 'border-border'
            }`}>
              <Mail className={`w-4 h-4 ${isVip ? 'text-gold' : 'text-primary'}`} />
              <span className="text-text-secondary select-all font-medium">{customer.email}</span>
            </div>
            <div className={`flex items-center justify-center md:justify-start space-x-2 bg-background border p-2.5 rounded-xl ${
              isVip ? 'border-gold/20' : 'border-border'
            }`}>
              <Phone className={`w-4 h-4 ${isVip ? 'text-gold' : 'text-accent-cyan'}`} />
              <span className="text-text-secondary font-mono select-all font-medium">{customer.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KPI Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isVip ? (
          <div className="bg-card border-gold/30 p-5 rounded-xl space-y-1.5 shadow-[0_0_15px_rgba(212,175,55,0.03)] hover:border-gold/50 transition-all border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none group-hover:bg-gold/10 transition-colors"></div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Total LTV Spend</span>
              <DollarSign className="w-4 h-4 text-gold" />
            </div>
            <p className="text-2xl font-black text-gold">{formatCurrency(customer.totalSpend)}</p>
            <span className="text-[9px] text-text-secondary leading-normal block">Gross revenue generated across transactions.</span>
          </div>
        ) : (
          <div className="bg-card border border-border p-5 rounded-xl space-y-1.5 shadow-sm hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Total LTV Spend</span>
              <DollarSign className="w-4 h-4 text-accent-emerald" />
            </div>
            <p className="text-2xl font-black text-accent-emerald">{formatCurrency(customer.totalSpend)}</p>
            <span className="text-[9px] text-text-secondary leading-normal block">Gross revenue generated across transactions.</span>
          </div>
        )}

        <div className={`bg-card border p-5 rounded-xl space-y-1.5 shadow-sm hover:border-primary/20 transition-all ${
          isVip ? 'border-gold/20' : 'border-border'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className={`w-4 h-4 ${isVip ? 'text-gold' : 'text-primary'}`} />
          </div>
          <p className="text-2xl font-black text-text-primary">{customer.ordersCount}</p>
          <span className="text-[9px] text-text-secondary leading-normal block">Successful checkout receipts completed.</span>
        </div>

        <div className={`bg-card border p-5 rounded-xl space-y-1.5 shadow-sm hover:border-primary/20 transition-all ${
          isVip ? 'border-gold/20' : 'border-border'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Average Order Value (AOV)</span>
            <Award className={`w-4 h-4 ${isVip ? 'text-gold' : 'text-accent-cyan'}`} />
          </div>
          <p className="text-2xl font-black text-text-primary">{formatCurrency(avgOrderValue)}</p>
          <span className="text-[9px] text-text-secondary leading-normal block">Mean transaction basket value.</span>
        </div>

        <div className={`bg-card border p-5 rounded-xl space-y-1.5 shadow-sm hover:border-primary/20 transition-all ${
          isVip ? 'border-gold/20' : 'border-border'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Assigned Cohorts</span>
            <Tag className={`w-4 h-4 ${isVip ? 'text-gold' : 'text-accent-amber'}`} />
          </div>
          <div className="flex flex-wrap gap-1 pt-1.5">
            {customer.segments.map((seg, idx) => {
              const isSegVip = seg.toUpperCase() === 'VIP';
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold border capitalize tracking-wide select-none ${
                    isSegVip
                      ? 'bg-gold/15 text-gold border-gold/25 shadow-[0_0_8px_rgba(212,175,55,0.15)]'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}
                >
                  {seg}
                </span>
              );
            })}
          </div>
          <span className="text-[9px] text-text-secondary leading-normal block pt-1">Cohorts matching segment profiles.</span>
        </div>
      </div>

      {/* 4. AI Persona & Copilot Intelligence Card */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 shadow-md transition-all duration-300 ${
        isVip 
          ? 'bg-gradient-to-r from-gold/5 via-card to-background border-gold/25 shadow-[0_4px_30px_rgba(212,175,55,0.04)]' 
          : 'bg-gradient-to-r from-primary/5 to-accent-cyan/5 border-border'
      }`}>
        {/* Glow backdrop */}
        {isVip ? (
          <>
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          </>
        ) : (
          <>
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
          </>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg ${isVip ? 'bg-gold/10 text-gold' : 'bg-primary/10 text-primary'}`}>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">Xeno AI Copilot Persona Insights</h3>
              <p className="text-[11px] text-text-secondary">AI-generated cohort persona & next-best-action playbook</p>
            </div>
          </div>
          {isVip ? (
            <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-[10px] font-black uppercase tracking-wider text-gold flex items-center space-x-1 shadow-[0_0_8px_rgba(212,175,55,0.1)] self-start sm:self-auto">
              <Crown className="w-3 h-3 text-gold animate-pulse" />
              <span>VIP Executive Strategy Active</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/35 text-[10px] font-black uppercase tracking-wider text-accent-cyan self-start sm:self-auto">
              ⚡ Agentic Recommendation Ready
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
          {/* Card 1: Behavioral Persona */}
          <div className={`bg-card/75 border p-4.5 rounded-xl space-y-3 shadow-sm transition-all ${
            isVip ? 'border-gold/20 hover:border-gold/35' : 'border-border hover:border-primary/20'
          }`}>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Behavioral Persona</span>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              {isVip
                ? 'High-intent VIP shopper with consistent spending. High affinity for personalized exclusive offers and direct communication.'
                : isCartAbandoner
                ? 'Impulsive high-intent browser with frequent cart drop-offs. Highly responsive to WhatsApp reminders and checkout recovery discount codes.'
                : isInactive
                ? 'Dormant user showing decreased campaign engagement. Requires a win-back campaign with direct SMS or email incentives.'
                : 'Steady user maintaining a healthy baseline engagement level. Responds well to monthly promotional summaries.'}
            </p>
          </div>

          {/* Card 2: Timing & Channel Propensity */}
          <div className={`bg-card/75 border p-4.5 rounded-xl space-y-3.5 shadow-sm transition-all ${
            isVip ? 'border-gold/20 hover:border-gold/35' : 'border-border hover:border-primary/20'
          }`}>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Engagement Propensities</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-border/40">
                <span className="text-text-muted">Optimal Day/Time:</span>
                <span className="font-semibold text-text-primary">Tuesday (9:00 - 11:00 AM)</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-border/40">
                <span className="text-text-muted">Channel Propensity:</span>
                <span className={`font-semibold ${isVip ? 'text-gold' : 'text-primary'}`}>{isVip ? 'WhatsApp' : isCartAbandoner ? 'WhatsApp & Email' : 'SMS'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-text-muted">Estimated Open Rate:</span>
                <span className={`font-extrabold bg-accent-emerald/10 px-2 py-0.5 rounded-full border border-accent-emerald/20 text-[10px] ${
                  isVip ? 'text-gold bg-gold/5 border-gold/20' : 'text-accent-emerald'
                }`}>87.5%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Next Strategic Action */}
          <div className={`bg-card/75 border p-4.5 rounded-xl space-y-2.5 shadow-sm transition-all ${
            isVip 
              ? 'border-gold/20 border-l-2 border-l-gold hover:border-gold/35' 
              : 'border-border border-l-2 border-l-primary hover:border-primary/20'
          }`}>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Next Strategic Action</span>
            <p className="font-bold text-text-primary text-xs">
              {isVip
                ? 'Send VIP Loyalty Reward'
                : isCartAbandoner
                ? 'Dispatch Cart Abandonment Recovery Coupon'
                : 'Trigger Win-back Offer via SMS'}
            </p>
            <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
              {isVip
                ? 'Trigger an automated VIP coupon on their optimal channel to maximize cross-sale conversions.'
                : isCartAbandoner
                ? 'Deliver a direct checkout link with a dynamic 10% coupon to nudge the pending basket checkout.'
                : 'Deliver a high-value flat discount code to re-engage interest.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Detailed Data Grid (Ledger & Touchpoints) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        {/* Left column (60%) - Order Ledger */}
        <div className={`lg:col-span-6 bg-card border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between ${
          isVip ? 'border-gold/20' : 'border-border'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingBag className={`w-4 h-4 ${isVip ? 'text-gold' : 'text-primary'}`} />
                <h3 className="text-sm font-semibold text-text-primary">Order Ledger & Receipts</h3>
              </div>
              <span className="text-[10px] text-text-muted font-mono">{customer.ordersCount} total</span>
            </div>

            {!customer.orders || customer.orders.length === 0 ? (
              <div className="bg-background/60 border border-border p-6 rounded-lg text-center text-xs text-text-secondary">
                <ShoppingBag className="w-6 h-6 text-text-muted mx-auto mb-2" />
                <span>No orders found in transaction database.</span>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[450px] overflow-y-auto pr-1">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-card z-10 shadow-[0_1px_0_0_var(--border)]">
                    <tr className="border-b border-border bg-background/90 text-[9px] uppercase font-bold text-text-muted tracking-wider">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-[11px]">
                    {customer.orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-background/60 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-text-secondary select-all">
                          #{ord.id.substring(0, 8)}
                        </td>
                        <td className="px-4 py-3.5 text-text-muted">
                          {formatDateTime(ord.createdAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${
                            ord.status.toUpperCase() === 'PAID' || ord.status.toUpperCase() === 'DELIVERED'
                              ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/25'
                              : ord.status.toUpperCase() === 'REFUNDED'
                              ? 'bg-accent-rose/10 text-accent-rose border-accent-rose/25'
                              : 'bg-accent-amber/10 text-accent-amber border-accent-amber/25'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-extrabold text-accent-emerald">
                          {formatCurrency(ord.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right column (40%) - Marketing Touchpoints timeline */}
        <div className={`lg:col-span-4 bg-card border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between ${
          isVip ? 'border-gold/20' : 'border-border'
        }`}>
          <div>
            <div className="flex items-center space-x-2 border-b border-border/60 pb-3 mb-4">
              <Send className={`w-4 h-4 ${isVip ? 'text-gold' : 'text-accent-cyan'}`} />
              <h3 className="text-sm font-semibold text-text-primary">Marketing Dispatch Touchpoints</h3>
            </div>

            {!customer.campaignHistory || customer.campaignHistory.length === 0 ? (
              <div className="bg-background/60 border border-border p-6 rounded-lg text-center text-xs text-text-secondary">
                <Send className="w-6 h-6 text-text-muted mx-auto mb-2" />
                <span>No dispatches recorded for this customer.</span>
              </div>
            ) : (
              <div className="max-h-[450px] overflow-y-auto pr-1">
                <div className={`relative border-l ml-3 pl-5 space-y-4 py-1 ${isVip ? 'border-gold/20' : 'border-border'}`}>
                  {customer.campaignHistory.map((hist, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline point */}
                      <span className={`absolute -left-[27px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background border ${
                        isVip ? 'border-gold/40' : 'border-primary/40'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isVip ? 'bg-gold' : 'bg-primary'}`}></span>
                      </span>

                      {/* Touchpoint Card */}
                      <div className={`bg-background/40 border p-3 rounded-xl flex flex-col justify-between space-y-2 group transition-all ${
                        isVip ? 'border-gold/10 hover:border-gold/30' : 'border-border hover:border-primary/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <p className={`text-[11px] font-bold text-text-primary transition-colors ${
                            isVip ? 'group-hover:text-gold' : 'group-hover:text-primary'
                          }`}>
                            {hist.campaignName}
                          </p>
                          <StatusBadge status={hist.status} type="recipient" />
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-text-muted pt-1 border-t border-border/20">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(hist.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
