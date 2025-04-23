import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { DatabaseRepo } from './Database.repo';
import { Category, CategoryDocument } from '../models/index';

@Injectable()
export class CategoryRepoService extends DatabaseRepo<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    private readonly _CategoryModel: Model<CategoryDocument>,
  ) {
    super(_CategoryModel);
  }

  async categoryExists(
    data: FilterQuery<CategoryDocument>,
  ): Promise<CategoryDocument> {
    const category = await this.findOne(data);

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }
}
