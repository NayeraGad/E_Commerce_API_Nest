import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepoService } from '../../DB/repository/index';
import { CategoryModel } from '../../DB/models/index.js';

@Module({
  imports: [CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepoService],
})
export class CategoryModule {}
