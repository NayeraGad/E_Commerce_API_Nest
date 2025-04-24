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
  forgetPasswordDTO,
  loginDTO,
  resetPasswordDTO,
  SignUpDTO,
  updatePasswordDTO,
} from './userDTO/customUser.dto.js';
import { Auth, UserDecorator, UserRoles } from '../../common/index.js';
import { UserDocument } from '../../DB/models/usersModel.js';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  // Sign up
  @Post('/signup')
  @UsePipes(new ValidationPipe())
  signup(@Body() body: SignUpDTO): any {
    return this._userService.signup(body);
  }

  // Confirm Email
  @Patch('/confirmEmail')
  @UsePipes(new ValidationPipe())
  confirmEmail(@Body() body: ConfirmEmailDTO): any {
    return this._userService.confirmEmail(body);
  }

  // Login
  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  login(@Body() body: loginDTO): any {
    return this._userService.login(body);
  }

  // Get Profile
  @Auth(UserRoles.user)
  @Get('/profile')
  @HttpCode(200)
  getProfile(@UserDecorator() user: UserDocument): any {
    return { user };
  }

  // Forget Password
  @Post('forget-password')
  @UsePipes(new ValidationPipe())
  async forgetPassword(@Body() body: forgetPasswordDTO) {
    return await this._userService.forgetPassword(body);
  }

  // Reset Password
  @Patch('reset-password')
  @UsePipes(new ValidationPipe())
  async resetPassword(@Body() body: resetPasswordDTO) {
    return await this._userService.resetPassword(body);
  }

  // Update Password
  @Patch('update-password')
  @Auth(UserRoles.user)
  @UsePipes(new ValidationPipe())
  async updatePassword(
    @Body() body: updatePasswordDTO,
    @UserDecorator() user: UserDocument,
  ) {
    return await this._userService.updatePassword(body, user);
  }
}
