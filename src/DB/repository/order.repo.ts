import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { DatabaseRepo } from './Database.repo';
import { Order, OrderDocument } from '../models/index';

@Injectable()
export class OrderRepoService extends DatabaseRepo<OrderDocument> {
  constructor(
    @InjectModel(Order.name)
    private readonly _OrderModel: Model<OrderDocument>,
  ) {
    super(_OrderModel);
  }

  async OrderExists(
    query: FilterQuery<OrderDocument>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<OrderDocument> {
    const order = await this.findOne(query, populate);

    if (!order) throw new NotFoundException('Order not found');

    return order;
  }
}
