import {
  Body,
  Controller,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import { Auth, UserDecorator, UserRoles } from '../../common/index.js';
import { UserDocument } from '../../DB/models/usersModel.js';
import { cartDTO, removeFromCartDTO } from './cartDTO/index.js';

@Controller('cart')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  // Add product to cart
  @Post('add')
  @Auth(UserRoles.user)
  @UsePipes(new ValidationPipe())
  async addToCart(@Body() body: cartDTO, @UserDecorator() user: UserDocument) {
    return this.CartService.addToCart(body, user);
  }

  // Remove product to cart
  @Patch('remove')
  @Auth(UserRoles.user)
  @UsePipes(new ValidationPipe())
  async removeFromCart(
    @Body() body: removeFromCartDTO,
    @UserDecorator() user: UserDocument,
  ) {
    return this.CartService.removeFromCart(body, user);
  }

  // Update quantity
  @Patch('update')
  @Auth(UserRoles.user)
  @UsePipes(new ValidationPipe())
  async updateQuantity(
    @Body() body: cartDTO,
    @UserDecorator() user: UserDocument,
  ) {
    return this.CartService.updateQuantity(body, user);
  }
}
