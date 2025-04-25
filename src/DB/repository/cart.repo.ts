import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { DatabaseRepo } from './Database.repo';
import { Cart, CartDocument } from '../models/index';

@Injectable()
export class CartRepoService extends DatabaseRepo<CartDocument> {
  constructor(
    @InjectModel(Cart.name)
    private readonly _CartModel: Model<CartDocument>,
  ) {
    super(_CartModel);
  }

  async CartExists(
    query: FilterQuery<CartDocument>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<CartDocument> {
    const cart = await this.findOne(query, populate);

    if (!cart || !cart.products.length)
      throw new NotFoundException('Cart not found');

    return cart;
  }
}
