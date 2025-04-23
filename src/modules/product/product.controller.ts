import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  Auth,
  ImageAllowedExtensions,
  multerConfig,
  UserDecorator,
  UserRoles,
  VideoAllowedExtensions,
} from '../../common/index';
import * as DTO from './productDTO/index';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserDocument } from '../../DB/models/usersModel';
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}

  // Create product
  @Post('create')
  @HttpCode(201)
  @Auth(UserRoles.admin)
  @UsePipes(new ValidationPipe({}))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
      ],
      multerConfig({
        allowExtensions: {
          coverImage: ImageAllowedExtensions,
          subImages: [...ImageAllowedExtensions, ...VideoAllowedExtensions],
        },
      }),
    ),
  )
  async createProduct(
    @Body() body: DTO.CreateProductDTO,
    @UserDecorator() user: UserDocument,
    @UploadedFiles()
    files: {
      coverImage: Express.Multer.File[];
      subImages?: Express.Multer.File[];
    },
  ) {
    return this.ProductService.createProduct(body, user, files);
  }

  // update product
  @Patch('update/:id')
  @Auth(UserRoles.admin)
  @UsePipes(new ValidationPipe({}))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
      ],
      multerConfig({
        allowExtensions: {
          coverImage: ImageAllowedExtensions,
          subImages: [...ImageAllowedExtensions, ...VideoAllowedExtensions],
        },
      }),
    ),
  )
  async updateProduct(
    @Body() body: DTO.UpdateProductDTO,
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
    @UploadedFiles()
    files?: {
      coverImage?: Express.Multer.File[];
      subImages?: Express.Multer.File[];
    },
  ) {
    return this.ProductService.updateProduct(body, id, user, files);
  }

  // Get all products
  @Get()
  async getAllProducts(@Query() query: DTO.QueryDTO) {
    return await this.ProductService.getAllProducts(query);
  }
}
