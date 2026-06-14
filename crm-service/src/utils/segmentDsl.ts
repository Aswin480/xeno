import { Customer, Order } from '@prisma/client';

export interface DslCondition {
  field: 'total_spend' | 'orders_count' | 'last_order_days' | 'segment' | 'email';
  operator: 'equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte';
  value: string | number;
}

export interface SegmentDsl {
  conditions: DslCondition[];
  logicalOperator?: 'AND' | 'OR';
}

type CustomerWithOrders = Customer & { orders: Order[] };

/**
 * Evaluates whether a customer satisfies the DSL criteria
 */
export function evaluateCustomer(customer: CustomerWithOrders, dsl: SegmentDsl): boolean {
  if (!dsl || !dsl.conditions || dsl.conditions.length === 0) {
    return true; // Empty conditions target all customers
  }

  const logicalOperator = dsl.logicalOperator || 'AND';
  const results = dsl.conditions.map(condition => {
    return evaluateCondition(customer, condition);
  });

  if (logicalOperator === 'OR') {
    return results.some(r => r === true);
  } else {
    return results.every(r => r === true);
  }
}

function evaluateCondition(customer: CustomerWithOrders, condition: DslCondition): boolean {
  const { field, operator, value } = condition;

  switch (field) {
    case 'total_spend': {
      const totalSpend = customer.orders
        .filter(o => o.status === 'COMPLETED')
        .reduce((sum, o) => sum + o.amount, 0);
      return compareNumbers(totalSpend, operator, Number(value));
    }
    case 'orders_count': {
      const count = customer.orders.filter(o => o.status === 'COMPLETED').length;
      return compareNumbers(count, operator, Number(value));
    }
    case 'last_order_days': {
      const completedOrders = customer.orders.filter(o => o.status === 'COMPLETED');
      if (completedOrders.length === 0) {
        // No orders completed. If the filter is "last_order_days gt/gte X", it's true (infinity). If "lt/lte X", it's false.
        if (operator === 'gt' || operator === 'gte') return true;
        return false;
      }
      const lastOrderDate = new Date(Math.max(...completedOrders.map(o => new Date(o.createdAt).getTime())));
      const diffTime = Math.abs(Date.now() - lastOrderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return compareNumbers(diffDays, operator, Number(value));
    }
    case 'segment': {
      // customer.segments is a JSON array or comma separated string
      let customerSegments: string[] = [];
      try {
        customerSegments = JSON.parse(customer.segments);
      } catch {
        customerSegments = customer.segments.split(',').map(s => s.trim());
      }
      const targetVal = String(value).toLowerCase();
      if (operator === 'equals') {
        return customerSegments.some(s => s.toLowerCase() === targetVal);
      } else if (operator === 'contains') {
        return customerSegments.some(s => s.toLowerCase().includes(targetVal));
      }
      return false;
    }
    case 'email': {
      const email = customer.email.toLowerCase();
      const targetVal = String(value).toLowerCase();
      if (operator === 'equals') {
        return email === targetVal;
      } else if (operator === 'contains') {
        return email.includes(targetVal);
      }
      return false;
    }
    default:
      return false;
  }
}

function compareNumbers(actual: number, operator: string, target: number): boolean {
  switch (operator) {
    case 'equals':
      return actual === target;
    case 'gt':
      return actual > target;
    case 'gte':
      return actual >= target;
    case 'lt':
      return actual < target;
    case 'lte':
      return actual <= target;
    default:
      return false;
  }
}

/**
 * Parses and returns a safe DSL object from string or JSON
 */
export function parseDsl(dslString: string): SegmentDsl {
  try {
    return JSON.parse(dslString) as SegmentDsl;
  } catch {
    // Return empty DSL
    return { conditions: [], logicalOperator: 'AND' };
  }
}
