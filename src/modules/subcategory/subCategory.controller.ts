import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubCategoryService } from './subCategory.service';
import {
  Auth,
  ImageAllowedExtensions,
  multerConfig,
  UserDecorator,
  UserRoles,
} from '../../common/index';
import * as DTO from './subCategoryDTO/index';
import { UserDocument } from '../../DB/models/usersModel';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

@Controller(['category/:categoryId/subCategory', 'subcategory'])
export class SubCategoryController {
  constructor(private readonly _subCategoryService: SubCategoryService) {}

  // Create subcategory
  @Post('create')
  @HttpCode(201)
  @Auth(UserRoles.admin)
  @UsePipes(new ValidationPipe({}))
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerConfig({
        allowExtensions: { image: ImageAllowedExtensions },
      }),
    ),
  )
  async createSubCategory(
    @Body() body: DTO.createSubCategoryDTO,
    @Param('categoryId') categoryId: Types.ObjectId,
    @UserDecorator()
    user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._subCategoryService.createSubCategory(
      body,
      user,
      file,
      categoryId,
    );
  }

  // Update subcategory
  @Patch('update/:id')
  @Auth(UserRoles.admin)
  @UsePipes(new ValidationPipe({}))
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerConfig({
        allowExtensions: { image: ImageAllowedExtensions },
      }),
    ),
  )
  async updateSubCategory(
    @Body() body: DTO.updateSubCategoryDTO,
    @Param('categoryId') categoryId: Types.ObjectId,
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._subCategoryService.updateSubCategory(
      body,
      user,
      file,
      id,
      categoryId,
    );
  }

  // Delete subcategory
  @Delete('delete/:id')
  @Auth(UserRoles.admin)
  @UsePipes(new ValidationPipe({}))
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerConfig({
        allowExtensions: { image: ImageAllowedExtensions },
      }),
    ),
  )
  async deleteSubCategory(
    @Param('id') id: Types.ObjectId,
    @Param('categoryId') categoryId: Types.ObjectId,
    @UserDecorator() user: UserDocument,
  ) {
    return this._subCategoryService.deleteSubCategory(user, id, categoryId);
  }

  // Get category
  @Get(':id')
  @UsePipes(new ValidationPipe({}))
  async getSubCategory(@Param('id') id: Types.ObjectId) {
    return this._subCategoryService.getSubCategory(id);
  }

  // Get all categories
  @Get()
  async getAllSubCategories() {
    return this._subCategoryService.getAllSubCategories();
  }
}
