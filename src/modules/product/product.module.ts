import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {
  BrandModel,
  CategoryModel,
  ProductModel,
  SubCategoryModel,
} from '../../DB/models/index';
import {
  BrandRepoService,
  CategoryRepoService,
  ProductRepoService,
  SubCategoryRepoService,
} from '../../DB/repository/index';

@Module({
  imports: [ProductModel, CategoryModel, SubCategoryModel, BrandModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepoService,
    CategoryRepoService,
    SubCategoryRepoService,
    BrandRepoService,
  ],
})
export class ProductModule {}
