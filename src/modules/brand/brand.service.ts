import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BrandRepoService,
  SubCategoryRepoService,
} from '../../DB/repository/index';
import * as DTO from './brandDTO/index';
import { UserDocument } from '../../DB/models/usersModel';
import { FileUploadService } from '../../common/index.js';
import { Types } from 'mongoose';
import slugify from 'slugify';

@Injectable()
export class BrandService {
  constructor(
    private readonly BrandRepoService: BrandRepoService,
    private readonly SubCategoryRepoService: SubCategoryRepoService,
    private readonly FileUploadService: FileUploadService,
  ) {}

  // ************************createBrand**************************
  async createBrand(
    body: DTO.createBrandDTO,
    user: UserDocument,
    file: Express.Multer.File,
    subCategoryId: Types.ObjectId,
  ) {
    const { name } = body;

    if (await this.BrandRepoService.findOne({ name }))
      throw new BadRequestException('Category name already exists');

    const subcategory = await this.SubCategoryRepoService.subCategoryExists(
      {
        _id: subCategoryId,
      },
      { path: 'category' },
    );

    const data = {
      name,
      userId: user._id,
      category: subcategory.category._id,
      subCategory: subcategory._id,
    };

    if (file) {
      const customId = Math.random().toString(36).substring(2, 7);

      const { secure_url, public_id } = await this.FileUploadService.uploadFile(
        file,
        {
          folder: `${process.env.CLOUDINARY_FOLDER}/category/${subcategory.category['customId']}/subcategory/${subcategory.customId}/brand/${customId}`,
        },
      );

      data['image'] = { secure_url, public_id };
      data['customId'] = customId;
    }

    const brand = await this.BrandRepoService.create(data);

    return { message: 'done', brand };
  }

  // ************************updateBrand**************************
  async updateBrand(
    body: DTO.updateBrandDTO,
    user: UserDocument,
    file: Express.Multer.File,
    id: Types.ObjectId,
    subCategoryId: Types.ObjectId,
  ) {
    const brand = await this.BrandRepoService.brandExists(
      {
        _id: id,
        userId: new Types.ObjectId(user._id),
        subCategory: new Types.ObjectId(subCategoryId),
      },
      [{ path: 'category' }, { path: 'subCategory' }],
    );

    if (body?.name) {
      const { name } = body;

      if (
        await this.BrandRepoService.findOne({
          name: name.toLocaleLowerCase(),
        })
      ) {
        throw new BadRequestException('Category name already exists');
      }

      brand.name = name;
      brand.slug = slugify(name, {
        replacement: '-',
        lower: true,
        trim: true,
      });
    }

    if (file) {
      const { public_id, secure_url, customId } =
        await this.FileUploadService.updateFile({
          newFile: file,
          oldFile: brand.image ? brand.image['public_id'] : null,
          path: `${process.env.CLOUDINARY_FOLDER}/category/${brand.category['customId']}/subcategory/${brand.subCategory['customId']}/brand`,
          customId: brand.customId ? brand.customId : null,
        });

      brand.image = { public_id, secure_url };

      if (customId) brand.customId = customId;
    }

    if (body?.subCategory) {
      const subCategory = await this.SubCategoryRepoService.subCategoryExists({
        _id: body.subCategory,
      });

      brand.subCategory = subCategory._id;
    }

    await brand.save();
    return { message: 'done', brand };
  }

  // ************************deleteBrand**************************
  async deleteBrand(user: UserDocument, id: Types.ObjectId) {
    const brand = await this.BrandRepoService.findOneAndDelete(
      {
        _id: id,
        userId: new Types.ObjectId(user._id),
      },
      [{ path: 'category' }, { path: 'subCategory' }],
    );

    if (!brand)
      throw new NotFoundException('Brand not found or you are not the owner');

    if (brand.image) {
      await this.FileUploadService.deleteFolder(
        `${process.env.CLOUDINARY_FOLDER}/category/${brand.category['customId']}/subcategory/${brand.subCategory['customId']}/brand/${brand.customId}`,
      );
    }

    return { message: 'done' };
  }

  // ************************getBrand**************************
  async getBrand(id: Types.ObjectId) {
    const brand = await this.BrandRepoService.brandExists(
      {
        _id: id,
      },
      [{ path: 'category' }, { path: 'subCategory' }],
    );

    return { message: 'done', brand };
  }

  // ************************getAllBrands**************************
  async getAllBrands() {
    const brands = await this.BrandRepoService.find({
      populate: [{ path: 'category' }, { path: 'subCategory' }],
    });

    if (!brands?.length) throw new NotFoundException('No Brands add yet');

    return { message: 'done', brands };
  }
}
