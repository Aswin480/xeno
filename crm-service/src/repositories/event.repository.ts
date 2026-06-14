import { prisma } from '../config/prisma';
import { ChannelEvent } from '@prisma/client';

export class EventRepository {
  async create(data: {
    recipientId: string;
    eventId: string;
    eventType: string;
    payload: string;
  }): Promise<ChannelEvent> {
    return prisma.channelEvent.create({
      data,
    });
  }

  async findByEventId(eventId: string): Promise<ChannelEvent | null> {
    return prisma.channelEvent.findUnique({
      where: { eventId },
    });
  }
}
