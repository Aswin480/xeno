export interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segments: string[];
  ordersCount: number;
  totalSpend: number;
  createdAt: string;
  orders?: Order[];
  campaignHistory?: {
    campaignName: string;
    status: string;
    updatedAt: string;
  }[];
}
