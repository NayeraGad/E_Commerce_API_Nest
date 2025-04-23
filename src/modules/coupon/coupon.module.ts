import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponModel } from '../../DB/models/index';
import { CouponRepoService } from '../../DB/repository/index';

@Module({
  imports: [CouponModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepoService],
})
export class CouponModule {}
