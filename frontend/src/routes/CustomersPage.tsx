import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import CustomerSearch from '../components/customers/CustomerSearch';
import SegmentCards from '../components/customers/SegmentCards';
import CustomerTable from '../components/customers/CustomerTable';
import { Loader2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    customers,
    loading,
    error,
    fetchCustomers,
  } = useCustomers();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');

  // Debounce search query inputs
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      fetchCustomers(searchQuery, selectedSegment);
    }, 250);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchQuery, selectedSegment, fetchCustomers]);

  const handleRowClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Customer Directory</h2>
          <p className="text-xs text-text-secondary">Search, audit profiles, transaction ledgers, and marketing dispatches.</p>
        </div>

        {/* Search Input bar */}
        <CustomerSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Segment Filter Cards */}
      <SegmentCards
        selectedSegment={selectedSegment}
        onSelectSegment={setSelectedSegment}
      />

      {/* Main customer listing grid */}
      {loading && customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-text-secondary">Scanning customer records...</p>
        </div>
      ) : error ? (
        <div className="bg-accent-rose/10 border border-accent-rose/25 p-4 rounded-xl text-xs text-accent-rose">
          Failed to scan customers: {error}
        </div>
      ) : (
        <CustomerTable customers={customers} onRowClick={handleRowClick} />
      )}
    </div>
  );
};
export default CustomersPage;
