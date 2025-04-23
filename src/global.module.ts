import { Module, Global } from '@nestjs/common';
import { UserModel } from './DB/models/usersModel.js';
import { UserRepoService } from './DB/repository/index';
import { FileUploadService, TokenService } from './common/index';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [UserModel],
  controllers: [],
  providers: [UserRepoService, TokenService, JwtService, FileUploadService],
  exports: [
    UserRepoService,
    TokenService,
    JwtService,
    FileUploadService,
    UserModel,
  ],
})
export class GlobalModule {}
