import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepoService } from '../../DB/repository/index';
import * as DTO from './categoryDTO/index';
import { UserDocument } from '../../DB/models/usersModel';
import { FileUploadService } from '../../common/index.js';
import { Types } from 'mongoose';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(
    private readonly CategoryRepoService: CategoryRepoService,
    private readonly FileUploadService: FileUploadService,
  ) {}

  // ************************createCategory**************************
  async createCategory(
    body: DTO.createCategoryDTO,
    user: UserDocument,
    file: Express.Multer.File,
  ) {
    const { name } = body;

    if (await this.CategoryRepoService.findOne({ name }))
      throw new BadRequestException('Category name already exists');

    const data = {
      name,
      userId: user._id,
    };

    if (file) {
      const customId = Math.random().toString(36).substring(2, 7);

      const { secure_url, public_id } = await this.FileUploadService.uploadFile(
        file,
        {
          folder: `${process.env.CLOUDINARY_FOLDER}/category/${customId}`,
        },
      );

      data['image'] = { secure_url, public_id };
      data['customId'] = customId;
    }

    const category = await this.CategoryRepoService.create(data);

    return { message: 'done', category };
  }

  // ************************updateCategory**************************
  async updateCategory(
    body: DTO.updateCategoryDTO,
    user: UserDocument,
    file: Express.Multer.File,
    id: Types.ObjectId,
  ) {
    const category = await this.CategoryRepoService.findOne({
      _id: id,
      userId: user._id,
    });

    if (!category)
      throw new NotFoundException(
        'Category not found or you are not the owner',
      );

    if (body.name) {
      const { name } = body;

      if (
        await this.CategoryRepoService.findOne({
          name: name.toLocaleLowerCase(),
        })
      ) {
        throw new BadRequestException('Category name already exists');
      }

      category.name = name;
      category.slug = slugify(name, {
        replacement: '-',
        lower: true,
        trim: true,
      });
    }

    if (file) {
      const { public_id, secure_url, customId } =
        await this.FileUploadService.updateFile({
          newFile: file,
          oldFile: category.image ? category.image['public_id'] : null,
          path: `${process.env.CLOUDINARY_FOLDER}/category`,
          customId: category.customId ? category.customId : null,
        });

      category.image = { public_id, secure_url };

      if (customId) category.customId = customId;
    }

    await category.save();
    return { message: 'done', category };
  }

  // ************************deleteCategory**************************
  async deleteCategory(user: UserDocument, id: Types.ObjectId) {
    const category = await this.CategoryRepoService.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!category)
      throw new NotFoundException(
        'Category not found or you are not the owner',
      );

    if (category.image) {
      await this.FileUploadService.deleteFolder(
        `${process.env.CLOUDINARY_FOLDER}/category/${category.customId}`,
      );
    }

    return { message: 'done' };
  }

  // ************************getCategory**************************
  async getCategory(id: Types.ObjectId) {
    const category = await this.CategoryRepoService.findById(id);

    if (!category) throw new NotFoundException('Category not found');

    return { message: 'done', category };
  }

  // ************************getAllCategories**************************
  async getAllCategories() {
    const categories = await this.CategoryRepoService.find({});

    if (!categories?.length)
      throw new NotFoundException('No categories add yet');

    return { message: 'done', categories };
  }
}
