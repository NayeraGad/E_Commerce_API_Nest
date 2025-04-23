import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { DatabaseRepo } from './Database.repo';
import { Product, ProductDocument } from '../models/index';

@Injectable()
export class ProductRepoService extends DatabaseRepo<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly _ProductModel: Model<ProductDocument>,
  ) {
    super(_ProductModel);
  }

  async productExists(
    query: FilterQuery<ProductDocument>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<ProductDocument> {
    const Product = await this.findOne(query, populate);

    if (!Product) throw new NotFoundException('Product not found');

    return Product;
  }
}
