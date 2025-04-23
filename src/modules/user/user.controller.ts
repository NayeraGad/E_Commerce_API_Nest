import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import {
  ConfirmEmailDTO,
  loginDTO,
  SignUpDTO,
} from './userDTO/customUser.dto.js';
import { Auth, UserDecorator, UserRoles } from '../../common/index.js';
import { UserDocument } from '../../DB/models/usersModel.js';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  signup(@Body() body: SignUpDTO): any {
    return this._userService.signup(body);
  }

  @Patch('/confirmEmail')
  @UsePipes(new ValidationPipe())
  confirmEmail(@Body() body: ConfirmEmailDTO): any {
    return this._userService.confirmEmail(body);
  }

  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  login(@Body() body: loginDTO): any {
    return this._userService.login(body);
  }

  @Auth(UserRoles.user)
  @Get('/profile')
  @HttpCode(200)
  getProfile(@UserDecorator() user: UserDocument): any {
    return { user };
  }
}
