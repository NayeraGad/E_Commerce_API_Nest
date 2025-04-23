import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoryRepoService,
  SubCategoryRepoService,
} from '../../DB/repository/index';
import * as DTO from './subCategoryDTO/index';
import { UserDocument } from '../../DB/models/usersModel';
import { FileUploadService } from '../../common/index.js';
import { Types } from 'mongoose';
import slugify from 'slugify';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly CategoryRepoService: CategoryRepoService,
    private readonly SubCategoryRepoService: SubCategoryRepoService,
    private readonly FileUploadService: FileUploadService,
  ) {}

  // ************************createSubCategory**************************
  async createSubCategory(
    body: DTO.createSubCategoryDTO,
    user: UserDocument,
    file: Express.Multer.File,
    categoryId: Types.ObjectId,
  ) {
    const { name } = body;

    if (await this.SubCategoryRepoService.findOne({ name }))
      throw new BadRequestException('Category name already exists');

    const category = await this.CategoryRepoService.categoryExists({
      _id: categoryId,
    });

    const data = {
      name,
      userId: user._id,
      category: category._id,
    };

    if (file) {
      const customId = Math.random().toString(36).substring(2, 7);

      const { secure_url, public_id } = await this.FileUploadService.uploadFile(
        file,
        {
          folder: `${process.env.CLOUDINARY_FOLDER}/category/${category.customId}/subcategory/${customId}`,
        },
      );

      data['image'] = { secure_url, public_id };
      data['customId'] = customId;
    }

    const subcategory = await this.SubCategoryRepoService.create(data);

    return { message: 'done', subcategory };
  }

  // ************************updateSubCategory**************************
  async updateSubCategory(
    body: DTO.updateSubCategoryDTO,
    user: UserDocument,
    file: Express.Multer.File,
    id: Types.ObjectId,
    categoryId: Types.ObjectId,
  ) {
    const subcategory = await this.SubCategoryRepoService.subCategoryExists(
      {
        _id: id,
        userId: new Types.ObjectId(user._id),
        category: new Types.ObjectId(categoryId),
      },
      { path: 'category' },
    );

    if (body?.name) {
      const { name } = body;

      if (
        await this.SubCategoryRepoService.findOne({
          name: name.toLocaleLowerCase(),
        })
      ) {
        throw new BadRequestException('Category name already exists');
      }

      subcategory.name = name;
      subcategory.slug = slugify(name, {
        replacement: '-',
        lower: true,
        trim: true,
      });
    }

    if (file) {
      const { public_id, secure_url, customId } =
        await this.FileUploadService.updateFile({
          newFile: file,
          oldFile: subcategory.image ? subcategory.image['public_id'] : null,
          path: `${process.env.CLOUDINARY_FOLDER}/category/${subcategory.category['customId']}/subcategory`,
          customId: subcategory.customId ? subcategory.customId : null,
        });

      subcategory.image = { public_id, secure_url };

      if (customId) subcategory.customId = customId;
    }

    if (body?.category) {
      const category = await this.CategoryRepoService.categoryExists({
        _id: body.category,
      });

      subcategory.category = category._id;
    }

    await subcategory.save();
    return { message: 'done', subcategory };
  }

  // ************************deleteSubCategory**************************
  async deleteSubCategory(
    user: UserDocument,
    id: Types.ObjectId,
    categoryId: Types.ObjectId,
  ) {
    const subcategory = await this.SubCategoryRepoService.findOneAndDelete(
      {
        _id: id,
        userId: new Types.ObjectId(user._id),
        category: new Types.ObjectId(categoryId),
      },
      { path: 'category' },
    );

    if (!subcategory)
      throw new NotFoundException(
        'Subcategory not found or you are not the owner',
      );

    if (subcategory.image) {
      await this.FileUploadService.deleteFolder(
        `${process.env.CLOUDINARY_FOLDER}/category/${subcategory.category['customId']}/subcategory/${subcategory.customId}`,
      );
    }

    return { message: 'done' };
  }

  // ************************getSubCategory**************************
  async getSubCategory(id: Types.ObjectId) {
    const subcategory = await this.SubCategoryRepoService.subCategoryExists(
      {
        _id: id,
      },
      { path: 'category' },
    );

    return { message: 'done', subcategory };
  }

  // ************************getAllSubCategories**************************
  async getAllSubCategories() {
    const subcategories = await this.SubCategoryRepoService.find({
      populate: [{ path: 'category' }],
    });

    if (!subcategories?.length)
      throw new NotFoundException('No subcategories add yet');

    return { message: 'done', subcategories };
  }
}
