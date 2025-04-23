import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OTPModel } from '../../DB/models/index';
import { OTPRepoService } from '../../DB/repository/index';

@Module({
  imports: [OTPModel],
  controllers: [UserController],
  providers: [UserService, OTPRepoService],
})
export class UserModule {}
