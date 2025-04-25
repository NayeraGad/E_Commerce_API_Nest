import { Query, Resolver } from '@nestjs/graphql';
import { OrderService } from 'src/modules/order/order.service';
import { OrderType } from '../types/order.types';
import { Auth, UserRoles } from 'src/common/index';

@Resolver()
export class OrderResolver {
  constructor(private readonly _OrderService: OrderService) {}

  @Auth(UserRoles.admin)
  @Query(() => [OrderType], {
    name: 'listOrders',
    description: 'listOfOrders',
  })
  async listOrders() {
    return await this._OrderService.getAllOrders();
  }
}
