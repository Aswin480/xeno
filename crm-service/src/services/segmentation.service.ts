import { CustomerRepository, CustomerWithOrders } from '../repositories/customer.repository';
import { parseDsl, evaluateCustomer } from '../utils/segmentDsl';
import { logger } from '../utils/logger';

export class SegmentationService {
  private customerRepo: CustomerRepository;

  constructor() {
    this.customerRepo = new CustomerRepository();
  }

  /**
   * Resolves a list of customers who match the campaign segment DSL criteria
   */
  async resolveSegment(dslString: string): Promise<CustomerWithOrders[]> {
    try {
      const dsl = parseDsl(dslString);
      const allCustomers = await this.customerRepo.findAll();

      if (allCustomers.length === 0) {
        return [];
      }

      const matchingCustomers = allCustomers.filter(customer => {
        return evaluateCustomer(customer, dsl);
      });

      logger.info(`Resolved segment: ${matchingCustomers.length}/${allCustomers.length} customers matched conditions.`);
      return matchingCustomers;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Error resolving segment DSL:', errorMsg);
      return [];
    }
  }
}
