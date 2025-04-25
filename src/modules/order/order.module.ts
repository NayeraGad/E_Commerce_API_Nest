import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  CartModel,
  CouponModel,
  OrderModel,
  ProductModel,
} from '../../DB/models/index';
import {
  CartRepoService,
  CouponRepoService,
  OrderRepoService,
  ProductRepoService,
} from '../../DB/repository/index';
import { PaymentService } from './service/payment';

@Module({
  imports: [OrderModel, CartModel, CouponModel, ProductModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepoService,
    CartRepoService,
    PaymentService,
    CouponRepoService,
    ProductRepoService,
  ],
  exports: [
    OrderService,
    OrderRepoService,
    CartRepoService,
    PaymentService,
    CouponRepoService,
    ProductRepoService,
  ],
})
export class OrderModule {}
