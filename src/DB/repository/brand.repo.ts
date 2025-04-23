import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { DatabaseRepo } from './Database.repo';
import { Brand, BrandDocument } from '../models/index';

@Injectable()
export class BrandRepoService extends DatabaseRepo<BrandDocument> {
  constructor(
    @InjectModel(Brand.name)
    private readonly _BrandModel: Model<BrandDocument>,
  ) {
    super(_BrandModel);
  }

  async brandExists(
    query: FilterQuery<BrandDocument>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<BrandDocument> {
    const Brand = await this.findOne(query, populate);

    if (!Brand) throw new NotFoundException('Brand not found');

    return Brand;
  }
}
