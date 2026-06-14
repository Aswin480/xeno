import { evaluateCustomer, SegmentDsl } from '../src/utils/segmentDsl';
import { Customer, Order } from '@prisma/client';

type CustomerWithOrders = Customer & { orders: Order[] };

describe('Segment DSL Evaluator', () => {
  const mockCustomer: CustomerWithOrders = {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    segments: JSON.stringify(['VIP', 'Cart Abandoner']),
    createdAt: new Date(),
    updatedAt: new Date(),
    orders: [
      {
        id: 'ord-1',
        customerId: 'cust-1',
        amount: 250.00,
        status: 'COMPLETED',
        category: 'Latte',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updatedAt: new Date(),
      },
      {
        id: 'ord-2',
        customerId: 'cust-1',
        amount: 350.00,
        status: 'COMPLETED',
        category: 'Latte',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(),
      },
      {
        id: 'ord-3',
        customerId: 'cust-1',
        amount: 100.00,
        status: 'PENDING',
        category: 'Latte',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  };

  test('should match customer when they meet total_spend gt criteria', () => {
    const dsl: SegmentDsl = {
      conditions: [
        { field: 'total_spend', operator: 'gt', value: 500 }
      ],
      logicalOperator: 'AND'
    };
    // Total spend = 250 + 350 = 600 (PENDING orders are ignored)
    expect(evaluateCustomer(mockCustomer, dsl)).toBe(true);
  });

  test('should not match customer when they do not meet total_spend gt criteria', () => {
    const dsl: SegmentDsl = {
      conditions: [
        { field: 'total_spend', operator: 'gt', value: 800 }
      ],
      logicalOperator: 'AND'
    };
    expect(evaluateCustomer(mockCustomer, dsl)).toBe(false);
  });

  test('should match customer segment tag', () => {
    const dsl: SegmentDsl = {
      conditions: [
        { field: 'segment', operator: 'equals', value: 'VIP' }
      ]
    };
    expect(evaluateCustomer(mockCustomer, dsl)).toBe(true);
  });

  test('should evaluate AND logic between multiple conditions', () => {
    const dsl: SegmentDsl = {
      conditions: [
        { field: 'segment', operator: 'equals', value: 'VIP' },
        { field: 'total_spend', operator: 'lt', value: 100 }
      ],
      logicalOperator: 'AND'
    };
    expect(evaluateCustomer(mockCustomer, dsl)).toBe(false);
  });

  test('should evaluate OR logic between multiple conditions', () => {
    const dsl: SegmentDsl = {
      conditions: [
        { field: 'segment', operator: 'equals', value: 'VIP' },
        { field: 'total_spend', operator: 'lt', value: 100 }
      ],
      logicalOperator: 'OR'
    };
    expect(evaluateCustomer(mockCustomer, dsl)).toBe(true);
  });

  test('should calculate last_order_days correctly', () => {
    const dsl: SegmentDsl = {
      conditions: [
        { field: 'last_order_days', operator: 'lte', value: 10 } // last order was 5 days ago
      ]
    };
    expect(evaluateCustomer(mockCustomer, dsl)).toBe(true);
  });
});
