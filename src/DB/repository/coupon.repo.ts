import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { DatabaseRepo } from './Database.repo';
import { Coupon, CouponDocument } from '../models/index';

@Injectable()
export class CouponRepoService extends DatabaseRepo<CouponDocument> {
  constructor(
    @InjectModel(Coupon.name)
    private readonly _CouponModel: Model<CouponDocument>,
  ) {
    super(_CouponModel);
  }

  async CouponExists(
    query: FilterQuery<CouponDocument>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<CouponDocument> {
    const Coupon = await this.findOne(query, populate);

    if (!Coupon)
      throw new NotFoundException('Coupon not found or used already');

    return Coupon;
  }

  async IsCodeExists(code: FilterQuery<CouponDocument>): Promise<boolean> {
    const Code = await this.findOne(code);

    if (Code) throw new BadRequestException('Coupon code already exist');

    return false;
  }
}
