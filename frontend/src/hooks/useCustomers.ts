import { useState, useCallback } from 'react';
import { Customer } from '../types/customer';
import { customersApi } from '../api/customers';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async (q?: string, segment?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customersApi.getCustomers(q, segment);
      setCustomers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomerById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customersApi.getCustomer(id);
      setSelectedCustomer(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load customer details');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelectedCustomer = useCallback(() => {
    setSelectedCustomer(null);
  }, []);

  return {
    customers,
    selectedCustomer,
    loading,
    error,
    fetchCustomers,
    fetchCustomerById,
    clearSelectedCustomer,
  };
};
