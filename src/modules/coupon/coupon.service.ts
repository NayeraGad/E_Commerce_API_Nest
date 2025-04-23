import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponRepoService } from '../../DB/repository/coupon.repo.js';
import { CreateCouponDTO, UpdateCouponDTO } from './couponDTO/index.js';
import { UserDocument } from '../../DB/models/usersModel.js';
import { Types } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(private readonly _CouponRepoService: CouponRepoService) {}

  // ************************createCoupon**************************
  async createCoupon(body: CreateCouponDTO, user: UserDocument) {
    const { code, amount, fromDate, toDate } = body;

    // Check if code already exist
    await this._CouponRepoService.IsCodeExists({ code });

    const coupon = await this._CouponRepoService.create({
      code,
      amount,
      fromDate,
      toDate,
      userId: user._id,
    });

    return { message: 'done', coupon };
  }

  // ************************updateCoupon**************************
  async updateCoupon(
    body: UpdateCouponDTO,
    user: UserDocument,
    id: Types.ObjectId,
  ) {
    const { code, amount, fromDate, toDate } = body;

    // Get coupon
    const coupon = await this._CouponRepoService.CouponExists({
      _id: id,
      userId: user._id,
    });

    if (code) {
      // Check if code already exist
      await this._CouponRepoService.IsCodeExists({ code });

      coupon.code = code;
    }

    if (amount) coupon.amount = amount;

    // Dates update
    if (fromDate && toDate) {
      coupon.fromDate = fromDate;
      coupon.toDate = toDate;
    } else if (fromDate && fromDate < coupon.toDate) {
      coupon.fromDate = fromDate;
    } else if (toDate && coupon.fromDate < toDate) {
      coupon.toDate = toDate;
    } else {
      throw new BadRequestException(`From date must be before to date`);
    }

    await coupon.save();

    return { message: 'done', coupon };
  }

  // ************************deleteCoupon**************************
  async deleteCoupon(id: Types.ObjectId, user: UserDocument) {
    const coupon = await this._CouponRepoService.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!coupon)
      throw new NotFoundException('Coupon not found or you are not the owner');

    return { message: 'done' };
  }
}
