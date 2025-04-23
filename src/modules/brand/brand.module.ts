import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import {
  BrandRepoService,
  CategoryRepoService,
  SubCategoryRepoService,
} from '../../DB/repository/index';
import {
  BrandModel,
  CategoryModel,
  SubCategoryModel,
} from '../../DB/models/index';
import {
  // CategoryController,
  CategoryService,
  SubCategoryController,
  SubCategoryService,
} from '../index';
import { BrandService } from './brand.service';

@Module({
  imports: [BrandModel, SubCategoryModel, CategoryModel],
  controllers: [SubCategoryController, BrandController],
  providers: [
    BrandService,
    BrandRepoService,
    SubCategoryService,
    CategoryService,
    CategoryRepoService,
    SubCategoryRepoService,
  ],
})
export class BrandModule {}
