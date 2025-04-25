import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  BrandModule,
  CartModule,
  CategoryModule,
  CouponModule,
  OrderModule,
  ProductModule,
  SubCategoryModule,
  UserModule,
} from './modules/index';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global.module.js';
import { CoreModule } from './core/core.module.js';

@Module({
  imports: [
    // .env config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),

    // Database connection
    MongooseModule.forRoot(process.env.URI as string, {
      onConnectionCreate(connection) {
        connection.on('connected', () => {
          console.log('Connected to database successfully');
          return connection;
        });
      },
    }),

    // Caching
    CoreModule,

    // App modules
    GlobalModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
