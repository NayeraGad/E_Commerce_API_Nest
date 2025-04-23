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
import {
  Auth,
  ImageAllowedExtensions,
  multerConfig,
  UserDecorator,
  UserRoles,
} from '../../common/index';
import * as DTO from './brandDTO/index';
import { UserDocument } from '../../DB/models/usersModel';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { BrandService } from './brand.service.js';

@Controller(['/subCategory/:subCategoryId/brand', 'brand'])
export class BrandController {
  constructor(private readonly _brandService: BrandService) {}

  // Create brand
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
  async createBrand(
    @Body() body: DTO.createBrandDTO,
    @Param('subCategoryId') subCategoryId: Types.ObjectId,
    @UserDecorator()
    user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._brandService.createBrand(body, user, file, subCategoryId);
  }

  // Update brand
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
  async updateBrand(
    @Body() body: DTO.updateBrandDTO,
    @Param('subCategoryId') subCategoryId: Types.ObjectId,
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._brandService.updateBrand(body, user, file, id, subCategoryId);
  }

  // Delete brand
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
  async deleteBrand(
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
  ) {
    return this._brandService.deleteBrand(user, id);
  }

  // Get brand
  @Get(':id')
  @UsePipes(new ValidationPipe({}))
  async getBrand(@Param('id') id: Types.ObjectId) {
    return this._brandService.getBrand(id);
  }

  // Get all brands
  @Get()
  async getAllBrands() {
    return this._brandService.getAllBrands();
  }
}
