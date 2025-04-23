import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Category, SubCategory, User } from './index.js';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Brand {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    unique: true,
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

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: SubCategory.name })
  subCategory: Types.ObjectId;

  @Prop({ type: Object })
  image: object;

  @Prop({ type: String })
  customId: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

export type BrandDocument = HydratedDocument<Brand>;

export const BrandModel = MongooseModule.forFeature([
  {
    name: Brand.name,
    schema: BrandSchema,
  },
]);
