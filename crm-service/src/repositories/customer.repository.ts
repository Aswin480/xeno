import { prisma } from '../config/prisma';
import { Customer, Order } from '@prisma/client';

export type CustomerWithOrders = Customer & { orders: Order[] };

export class CustomerRepository {
  async findAll(): Promise<CustomerWithOrders[]> {
    return prisma.customer.findMany({
      include: {
        orders: true,
      },
    });
  }

  async findById(id: string): Promise<(CustomerWithOrders & { recipients: { campaign: { name: string }; status: string; updatedAt: Date }[] }) | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
        recipients: {
          include: {
            campaign: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });
  }

  async count(): Promise<number> {
    return prisma.customer.count();
  }
}
