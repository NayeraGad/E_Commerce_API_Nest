import { Module } from '@nestjs/common';
import { SubCategoryController } from './subCategory.controller';
import {
  CategoryRepoService,
  SubCategoryRepoService,
} from '../../DB/repository/index';
import { CategoryModel, SubCategoryModel } from '../../DB/models/index.js';
import { CategoryController } from '../category/category.controller.js';
import { CategoryService } from '../category/category.service.js';
import { SubCategoryService } from './subCategory.service.js';

@Module({
  imports: [CategoryModel, SubCategoryModel],
  controllers: [CategoryController, SubCategoryController],
  providers: [
    SubCategoryService,
    CategoryService,
    CategoryRepoService,
    SubCategoryRepoService,
  ],
})
export class SubCategoryModule {}
