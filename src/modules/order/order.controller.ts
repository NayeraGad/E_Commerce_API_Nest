import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDTO } from './orderDTO/index';
import { Auth, UserDecorator, UserRoles } from '../../common/index';
import { UserDocument } from '../../DB/models/usersModel';
import { Types } from 'mongoose';

@Controller('order')
export class OrderController {
  constructor(private readonly _OrderService: OrderService) {}

  // Create order
  @Post('create')
  @HttpCode(201)
  @Auth(UserRoles.user)
  @UsePipes(new ValidationPipe())
  async createOrder(
    @Body() body: createOrderDTO,
    @UserDecorator() user: UserDocument,
  ) {
    return this._OrderService.createOrder(body, user);
  }

  // Pay with card
  @Post('pay-with-card/:id')
  @Auth(UserRoles.user)
  async payWithCard(
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
  ) {
    return this._OrderService.payWithCard(id, user);
  }

  // webhook
  @Post('webhook')
  async webhook(@Body() data: any) {
    return this._OrderService.webhook(data);
  }

  // Cancel order
  @Patch('cancel-order/:id')
  @Auth(UserRoles.user)
  async cancelOrder(
    @Param('id') id: Types.ObjectId,
    @UserDecorator() user: UserDocument,
  ) {
    return this._OrderService.cancelOrder(id, user);
  }
}
