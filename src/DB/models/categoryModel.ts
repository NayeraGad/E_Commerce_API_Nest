import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
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

  @Prop({ type: String })
  customId: string;

  @Prop({ type: Object })
  image: object;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export type CategoryDocument = HydratedDocument<Category>;

export const CategoryModel = MongooseModule.forFeature([
  {
    name: Category.name,
    schema: CategorySchema,
  },
]);
