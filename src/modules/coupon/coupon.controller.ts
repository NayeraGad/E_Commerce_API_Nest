import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDTO, UpdateCouponDTO } from './couponDTO/index';
import { Auth, UserDecorator, UserRoles } from '../../common/index';
import { UserDocument } from '../../DB/models/usersModel';
import { Types } from 'mongoose';

@Controller('coupon')
export class CouponController {
  constructor(private readonly _CouponService: CouponService) {}

  @Post('create')
  @HttpCode(201)
  @Auth(UserRoles.admin)
  @UsePipes(new ValidationPipe({}))
  async createCoupon(
    @Body() body: CreateCouponDTO,
    @UserDecorator() user: UserDocument,
  ) {
    return this._CouponService.createCoupon(body, user);
  }

  @Patch('update/:id')
  @Auth(UserRoles.admin)
  @UsePipes(new ValidationPipe({}))
  async updateCoupon(
    @Body() body: UpdateCouponDTO,
    @UserDecorator() user: UserDocument,
    @Param('id') id: Types.ObjectId,
  ) {
    return this._CouponService.updateCoupon(body, user, id);
  }

  @Delete('delete/:id')
  @Auth(UserRoles.admin)
  async deleteCoupon(
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
  ) {
    return this._CouponService.deleteCoupon(id, user);
  }
}
