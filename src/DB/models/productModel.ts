import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Brand, Category, SubCategory, User } from './index.js';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    lowercase: true,
  })
  name: string;

  @Prop({
    type: String,
    trim: true,
    default: function () {
      return slugify(this.name, { lower: true, replacement: '-' });
    },
  })
  slug: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  })
  description: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: SubCategory.name })
  subCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Brand.name })
  brand: Types.ObjectId;

  @Prop({ type: Object, required: true })
  coverImage: object;

  @Prop({ type: [Object] })
  subImages: object[];

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, min: 1, max: 100 })
  discount: number;

  @Prop({ type: Number })
  subPrice: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number })
  rateValue: number;

  @Prop({ type: Number })
  rateAvg: number;

  @Prop({ type: String })
  customId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type ProductDocument = HydratedDocument<Product>;

export const ProductModel = MongooseModule.forFeature([
  {
    name: Product.name,
    schema: ProductSchema,
  },
]);
