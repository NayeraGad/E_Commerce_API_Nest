import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartModel, CouponModel, OrderModel } from '../../DB/models/index';
import {
  CartRepoService,
  CouponRepoService,
  OrderRepoService,
} from '../../DB/repository/index';
import { PaymentService } from './service/payment';

@Module({
  imports: [OrderModel, CartModel, CouponModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepoService,
    CartRepoService,
    PaymentService,
    CouponRepoService,
  ],
})
export class OrderModule {}
