import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Category, User } from './index.js';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class SubCategory {
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

  @Prop({ type: Object })
  image: object;

  @Prop({ type: String })
  customId: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

export type SubCategoryDocument = HydratedDocument<SubCategory>;

export const SubCategoryModel = MongooseModule.forFeature([
  {
    name: SubCategory.name,
    schema: SubCategorySchema,
  },
]);
