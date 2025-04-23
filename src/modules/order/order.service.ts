import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CartRepoService,
  CouponRepoService,
  OrderRepoService,
} from '../../DB/repository/index';
import { createOrderDTO } from './orderDTO/index';
import { UserDocument } from '../../DB/models/usersModel';
import { orderStatusTypes, paymentMethodTypes } from '../../common/index';
import { Types } from 'mongoose';
import { PaymentService } from './service/payment';
import { CouponDocument } from '../../DB/models/couponModel.js';

interface ProductData {
  productId: {
    name: string;
    coverImage: { secure_url: string };
    subPrice: number;
  };
  quantity: number;
}

@Injectable()
export class OrderService {
  constructor(
    private readonly _OrderRepoService: OrderRepoService,
    private readonly _CartRepoService: CartRepoService,
    private readonly _PaymentService: PaymentService,
    private readonly _CouponRepoService: CouponRepoService,
  ) {}

  // ************************createOrder**************************
  async createOrder(body: createOrderDTO, user: UserDocument) {
    const { phone, address, paymentMethod, code } = body;
    const { _id: userId } = user;

    const cart = await this._CartRepoService.CartExists({ userId });

    let coupon: CouponDocument | undefined = undefined;

    if (code) {
      coupon = await this._CouponRepoService.CouponExists({
        code,
        usedBy: { $nin: [userId] },
      });
    }

    const order = await this._OrderRepoService.create({
      userId,
      phone,
      address,
      paymentMethod,
      cart: cart._id,
      totalPrice: cart.total,
      status:
        paymentMethod === paymentMethodTypes.cash
          ? orderStatusTypes.placed
          : orderStatusTypes.pending,
      coupon: coupon ? coupon._id : undefined,
    });

    return { message: 'done', order };
  }

  // ************************payWithCard**************************
  async payWithCard(id: Types.ObjectId, user: UserDocument) {
    const { _id: userId, email } = user;

    const order = await this._OrderRepoService.OrderExists(
      {
        _id: id,
        userId,
        status: orderStatusTypes.pending,
      },
      [
        {
          path: 'cart',
          select: 'products',
          populate: { path: 'products.productId' },
        },
        {
          path: 'coupon',
        },
      ],
    );

    const products = order.cart['products'] as ProductData[];

    let coupon: any;
    let cartCoupon: CouponDocument | undefined = undefined;

    if (order.coupon) {
      cartCoupon = await this._CouponRepoService.CouponExists({
        _id: order.coupon,
        usedBy: { $nin: [userId] },
      });

      coupon = await this._PaymentService.createCoupon({
        percent_off: order.coupon['amount'],
      });
    }

    const session = await this._PaymentService.createCheckout({
      customer_email: email,
      metadata: { orderId: order._id.toString() },
      line_items: products.map((product) => ({
        price_data: {
          currency: 'egp',
          product_data: {
            name: product.productId.name,
            images: [product.productId.coverImage.secure_url],
          },
          unit_amount: product.productId.subPrice * 100,
        },
        quantity: product.quantity,
      })),
      discounts: coupon ? [{ coupon: coupon.id }] : [],
    });

    // Add user to usedBy of coupon model
    cartCoupon?.usedBy.push(userId);
    await cartCoupon?.save();

    // Remove coupon after using it
    await this._OrderRepoService.findOneAndUpdate(
      { _id: order.id },
      { $unset: { coupon: 1 } },
    );

    return { message: 'done', session: session.url };
  }

  // ************************webhook**************************
  async webhook(data: any) {
    const { orderId } = data.data.object.metadata;
    const { payment_intent } = data.data.object;

    const order = await this._OrderRepoService.findOneAndUpdate(
      {
        _id: orderId,
      },
      {
        status: orderStatusTypes.paid,
        orderChanges: {
          paidAt: Date.now(),
        },
        paymentIntent: payment_intent,
      },
    );

    return { message: 'done', order };
  }

  // ************************cancelOrder**************************
  async cancelOrder(id: Types.ObjectId, user: UserDocument) {
    const order = await this._OrderRepoService.findOneAndUpdate(
      {
        _id: id,
        status: {
          $in: [
            orderStatusTypes.pending,
            orderStatusTypes.placed,
            orderStatusTypes.paid,
          ],
        },
      },
      {
        status: orderStatusTypes.cancelled,
        orderChanges: {
          cancelledAt: Date.now(),
          cancelledBy: user._id,
        },
      },
    );

    if (!order) throw new BadRequestException('Order not found');

    if (order.paymentMethod === paymentMethodTypes.card) {
      // Refund payment using stripe
      const refund = await this._PaymentService.refund({
        paymentIntent: order.paymentIntent,
        reason: 'requested_by_customer',
      });

      await this._OrderRepoService.findOneAndUpdate(
        {
          _id: order._id,
        },
        {
          status: orderStatusTypes.refunded,
          orderChanges: {
            refundedAt: new Date(refund.created * 1000),
            refundedBy: user._id,
          },
        },
      );
    }

    return { message: 'done', order };
  }
}
