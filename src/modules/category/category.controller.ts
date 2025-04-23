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
import { CategoryService } from './category.service';
import {
  Auth,
  ImageAllowedExtensions,
  multerConfig,
  UserDecorator,
  UserRoles,
} from '../../common/index';
import * as DTO from './categoryDTO/index';
import { UserDocument } from '../../DB/models/usersModel';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  // Create category
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
  async createCategory(
    @Body() body: DTO.createCategoryDTO,
    @UserDecorator() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._categoryService.createCategory(body, user, file);
  }

  // Update category
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
  async updateCategory(
    @Body() body: DTO.updateCategoryDTO,
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._categoryService.updateCategory(body, user, file, id);
  }

  // Delete category
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
  async deleteCategory(
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
  ) {
    return this._categoryService.deleteCategory(user, id);
  }

  // Get category
  @Get(':id')
  @UsePipes(new ValidationPipe({}))
  async getCategory(@Param('id') id: Types.ObjectId) {
    return this._categoryService.getCategory(id);
  }

  // Get all categories
  @Get()
  async getAllCategories() {
    return this._categoryService.getAllCategories();
  }
}
