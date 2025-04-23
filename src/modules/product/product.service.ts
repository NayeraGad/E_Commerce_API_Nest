import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateProductDTO,
  QueryDTO,
  UpdateProductDTO,
} from './productDTO/index';
import { ProductDocument, UserDocument } from '../../DB/models/index';
import {
  ProductRepoService,
  CategoryRepoService,
  SubCategoryRepoService,
  BrandRepoService,
} from '../../DB/repository/index';
import { FileUploadService } from '../../common/index';
import { FilterQuery, Types } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    private readonly _ProductRepoService: ProductRepoService,
    private readonly _FileUploadService: FileUploadService,
    private readonly _CategoryRepoService: CategoryRepoService,
    private readonly _SubCategoryRepoService: SubCategoryRepoService,
    private readonly _BrandRepoService: BrandRepoService,
  ) {}

  // ************************createProduct**************************
  async createProduct(
    body: CreateProductDTO,
    user: UserDocument,
    files: {
      coverImage: Express.Multer.File[];
      subImages?: Express.Multer.File[];
    },
  ) {
    const {
      name,
      description,
      category,
      subCategory,
      brand,
      price,
      discount,
      stock,
      quantity,
    } = body;

    // Check category
    const categoryExist = await this._CategoryRepoService.categoryExists({
      _id: category,
    });

    // Check subcategory
    const subCategoryExist =
      await this._SubCategoryRepoService.subCategoryExists({
        _id: subCategory,
      });

    // Check brand
    const brandExist = await this._BrandRepoService.brandExists({
      _id: brand,
    });

    // Images
    if (!files.coverImage)
      throw new BadRequestException('Cover image is required');

    const customId = Math.random().toString(36).substring(2, 7);

    const { secure_url, public_id } = await this._FileUploadService.uploadFile(
      files.coverImage[0],
      {
        folder: `${process.env.CLOUDINARY_FOLDER}/category/${categoryExist['customId']}/subcategory/${subCategoryExist['customId']}/brand/${brandExist['customId']}/product/${customId}`,
      },
    );

    const images: { secure_url: string; public_id: string }[] = [];
    if (files.subImages) {
      const data = await this._FileUploadService.uploadFiles(files.subImages, {
        folder: `${process.env.CLOUDINARY_FOLDER}/category/${categoryExist['customId']}/subcategory/${subCategoryExist['customId']}/brand/${brandExist['customId']}/product/${customId}`,
      });

      images.push(...data);
    }

    // Calculate subPrice
    const subPrice = price - price * ((discount || 0) / 100);

    const product = await this._ProductRepoService.create({
      name,
      description,
      userId: user._id,
      category,
      subCategory,
      brand,
      price,
      discount,
      coverImage: { secure_url, public_id },
      subImages: images,
      stock,
      quantity,
      subPrice,
      customId,
    });

    return { message: 'done', product };
  }

  // ************************updateProduct**************************
  async updateProduct(
    body: UpdateProductDTO,
    id: Types.ObjectId,
    user: UserDocument,
    files?: {
      coverImage?: Express.Multer.File[];
      subImages?: Express.Multer.File[];
    },
  ) {
    const { name, description, price, discount, stock, quantity } = body;

    const product = await this._ProductRepoService.productExists(
      {
        _id: id,
        userId: user._id,
      },
      [{ path: 'category' }, { path: 'subCategory' }, { path: 'brand' }],
    );

    if (name) product.name = name;
    if (description) product.description = description;

    // Update prices
    if (price && discount) {
      product.subPrice = price - price * ((discount || 0) / 100);
      product.price = price;
      product.discount = discount;
    } else if (price) {
      product.subPrice = price - price * ((product.discount || 0) / 100);
      product.price = price;
    } else if (discount) {
      product.subPrice =
        product.price - product.price * ((discount || 0) / 100);
      product.price = discount;
    }

    if (stock) product.stock = stock;
    if (quantity) {
      if (Number(quantity) > Number(stock)) {
        throw new BadRequestException('Quantity must be less than stocks');
      } else {
        product.quantity = quantity;
      }
    }

    // Images
    const subImages: { secure_url: string; public_id: string }[] = [];
    if (files?.subImages) {
      await this._FileUploadService.deleteFolder(
        `${process.env.CLOUDINARY_FOLDER}/category/${product.category['customId']}/subcategory/${product.subCategory['customId']}/brand/${product.brand['customId']}/product/${product.customId}`,
      );
      const data = await this._FileUploadService.uploadFiles(files.subImages, {
        folder: `${process.env.CLOUDINARY_FOLDER}/category/${product.category['customId']}/subcategory/${product.subCategory['customId']}/brand/${product.brand['customId']}/product/${product.customId}`,
      });

      subImages.push(...data);
      product.subImages = subImages;
    }

    if (files?.coverImage) {
      const { secure_url, public_id } =
        await this._FileUploadService.updateFile({
          newFile: files.coverImage[0],
          oldFile: product.coverImage['public_id'],
          path: `${process.env.CLOUDINARY_FOLDER}/category/${product.category['customId']}/subcategory/${product.subCategory['customId']}/brand/${product.brand['customId']}/product`,
          customId: product.customId,
        });

      product.coverImage = { secure_url, public_id };
    }

    await product.save();

    return { message: 'done', product };
  }

  // ************************getAllProducts**************************
  async getAllProducts(query: QueryDTO) {
    const { name, select, sort, limit, page } = query;

    let filterObject: FilterQuery<ProductDocument> = {};

    if (name) {
      filterObject = {
        $or: [{ name: { $regex: name } }, { slug: { $regex: name } }],
      };
    }

    const products = await this._ProductRepoService.find({
      filter: filterObject,
      populate: [
        { path: 'category', select: { name: 1 } },
        { path: 'subCategory', select: { name: 1 } },
        { path: 'brand', select: { name: 1 } },
      ],
      sort,
      select,
      limit,
      page,
    });

    if (!products?.length) throw new BadRequestException('No products add yet');

    return { message: 'done', products };
  }
}
