import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { OrderResolver } from './resolvers/order.resolver';
import { OrderModule } from 'src/modules/index';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: 'src/schema.gql',
    }),
    OrderModule,
  ],
  providers: [OrderResolver],
})
export class GraphQLConfigModule {}
