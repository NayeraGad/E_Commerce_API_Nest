import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepoService, ProductRepoService } from '../../DB/repository/index';
import { UserDocument } from '../../DB/models/usersModel';
import { cartDTO, removeFromCartDTO } from './cartDTO/index';

@Injectable()
export class CartService {
  constructor(
    private readonly CartRepoService: CartRepoService,
    private readonly ProductRepoService: ProductRepoService,
  ) {}

  // ************************addToCart**************************
  async addToCart(body: cartDTO, user: UserDocument) {
    const { productId, quantity } = body;

    const product = await this.ProductRepoService.productExists({
      _id: productId,
      stock: { $gte: quantity },
    });

    const cart = await this.CartRepoService.findOne({ userId: user._id });

    if (!cart) {
      return await this.CartRepoService.create({
        products: [{ productId, quantity, subPrice: product.subPrice }],
        userId: user._id,
      });
    }

    const productExist = cart.products.find(
      (product) => product.productId.toString() === productId.toString(),
    );

    if (productExist)
      throw new BadRequestException('Product already exists in cart');

    cart.products.push({
      productId: productId,
      quantity,
      subPrice: product.subPrice,
    });

    await cart.save();

    return { message: 'done', cart };
  }

  // ************************removeFromCart**************************
  async removeFromCart(body: removeFromCartDTO, user: UserDocument) {
    const { productId } = body;

    await this.ProductRepoService.productExists({
      _id: productId,
    });

    const cart = await this.CartRepoService.findOne({
      userId: user._id,
      'products.productId': productId,
    });

    if (!cart) throw new NotFoundException('Product not found in cart');

    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId.toString(),
    );

    await cart.save();

    return { message: 'done', cart };
  }

  // ************************updateQuantity**************************
  async updateQuantity(body: cartDTO, user: UserDocument) {
    const { productId, quantity } = body;

    const cart = await this.CartRepoService.findOne(
      {
        userId: user._id,
        'products.productId': productId,
      },
      [{ path: 'products.productId', select: 'stock' }],
    );

    if (!cart) throw new NotFoundException('Product not found in cart');

    const product = cart.products.find((product) => {
      return product.productId._id.toString() === productId.toString();
    });

    if (!product) throw new NotFoundException('Product not found in cart');

    if (quantity > product?.productId['stock'])
      throw new BadRequestException('Stock not available');

    product.quantity = quantity;

    await cart.save();

    return { message: 'done', cart };
  }
}
