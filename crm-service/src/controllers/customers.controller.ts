import { Request, Response, NextFunction } from 'express';
import { CustomerRepository } from '../repositories/customer.repository';
import { logger } from '../utils/logger';

export class CustomersController {
  private customerRepo: CustomerRepository;

  constructor() {
    this.customerRepo = new CustomerRepository();
  }

  getAllCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('API Call: GET /customers');
      const { q, segment } = req.query;

      let customers = await this.customerRepo.findAll();

      // Apply search queries
      if (q) {
        const queryStr = String(q).toLowerCase();
        customers = customers.filter(
          c =>
            c.name.toLowerCase().includes(queryStr) ||
            c.email.toLowerCase().includes(queryStr) ||
            c.phone.includes(queryStr)
        );
      }

      // Apply segment filters
      if (segment) {
        const segmentStr = String(segment).toLowerCase();
        customers = customers.filter(c => {
          try {
            const parsed = JSON.parse(c.segments) as string[];
            return parsed.some(s => s.toLowerCase() === segmentStr);
          } catch {
            return c.segments.toLowerCase().includes(segmentStr);
          }
        });
      }

      // Attach additional metrics for visual presentation: total spend and orders count
      const formattedCustomers = customers.map(c => {
        const completedOrders = c.orders.filter(o => o.status === 'COMPLETED');
        const totalSpend = completedOrders.reduce((sum, o) => sum + o.amount, 0);

        let parsedSegments: string[] = [];
        try {
          parsedSegments = JSON.parse(c.segments);
        } catch {
          parsedSegments = c.segments.split(',').map(s => s.trim());
        }

        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          segments: parsedSegments,
          ordersCount: completedOrders.length,
          totalSpend: Math.round(totalSpend * 100) / 100,
          createdAt: c.createdAt.toISOString(),
        };
      });

      res.status(200).json({
        success: true,
        data: formattedCustomers,
      });
    } catch (err) {
      logger.error('Error in CustomersController.getAllCustomers:', err);
      next(err);
    }
  };

  getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      logger.info(`API Call: GET /customers/${id}`);

      const customer = await this.customerRepo.findById(id);
      if (!customer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
        return;
      }

      // Compile formatted response
      const completedOrders = customer.orders.filter(o => o.status === 'COMPLETED');
      const totalSpend = completedOrders.reduce((sum, o) => sum + o.amount, 0);

      let parsedSegments: string[] = [];
      try {
        parsedSegments = JSON.parse(customer.segments);
      } catch {
        parsedSegments = customer.segments.split(',').map(s => s.trim());
      }

      res.status(200).json({
        success: true,
        data: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          segments: parsedSegments,
          createdAt: customer.createdAt.toISOString(),
          orders: customer.orders,
          totalSpend,
          ordersCount: completedOrders.length,
          campaignHistory: customer.recipients.map(r => ({
            campaignName: r.campaign.name,
            status: r.status,
            updatedAt: r.updatedAt.toISOString(),
          })),
        },
      });
    } catch (err) {
      logger.error('Error in CustomersController.getCustomerById:', err);
      next(err);
    }
  };
}

export default new CustomersController();
