import { api } from './axios';
import { Customer } from '../types/customer';

export const customersApi = {
  getCustomers: async (q?: string, segment?: string): Promise<Customer[]> => {
    const response = await api.get('/customers', {
      params: { q, segment },
    });
    return response.data.data;
  },

  getCustomer: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },
};
