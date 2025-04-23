import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { DatabaseRepo } from './Database.repo';
import { SubCategory, SubCategoryDocument } from '../models/index';

@Injectable()
export class SubCategoryRepoService extends DatabaseRepo<SubCategoryDocument> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly _SubCategoryModel: Model<SubCategoryDocument>,
  ) {
    super(_SubCategoryModel);
  }

  async subCategoryExists(
    query: FilterQuery<SubCategoryDocument>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<SubCategoryDocument> {
    const subCategory = await this.findOne(query, populate);

    if (!subCategory) throw new NotFoundException('Subcategory not found');

    return subCategory;
  }
}
