import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel, ProductModel } from '../../DB/models/index';
import { CartRepoService, ProductRepoService } from '../../DB/repository/index';

@Module({
  imports: [CartModel, ProductModel],
  controllers: [CartController],
  providers: [CartService, CartRepoService, ProductRepoService],
})
export class CartModule {}
