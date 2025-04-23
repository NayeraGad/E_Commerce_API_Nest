import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor() {}

  private readonly stripe = new Stripe(process.env.STRIPE_SECRET as string);

  // Create checkout session
  async createCheckout({ customer_email, metadata, line_items, discounts }) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email,
      metadata,
      success_url: 'http://localhost:3000/order/success',
      cancel_url: 'http://localhost:3000/order/canceled',
      line_items,
      discounts,
    });
  }

  // Create coupon
  async createCoupon({ percent_off }) {
    return await this.stripe.coupons.create({
      percent_off,
      duration: 'once',
    });
  }

  // Refund
  async refund({ paymentIntent, reason }) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntent,
      reason,
    });
  }
}
