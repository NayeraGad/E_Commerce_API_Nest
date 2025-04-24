import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OTPRepoService, UserRepoService } from '../../DB/repository/index';
import {
  ConfirmEmailDTO,
  forgetPasswordDTO,
  loginDTO,
  resetPasswordDTO,
  SignUpDTO,
  updatePasswordDTO,
} from './userDTO/customUser.dto';
import {
  Compare,
  html,
  otpTypes,
  sendEmail,
  TokenService,
  UserRoles,
} from '../../common/index.js';
import { UserDocument } from 'src/DB/models/usersModel.js';

@Injectable()
export class UserService {
  constructor(
    private readonly UserRepoService: UserRepoService,
    private readonly TokenService: TokenService,
    private readonly OTPRepoService: OTPRepoService,
  ) {}

  // ************************signup**************************
  async signup(body: SignUpDTO) {
    try {
      const { name, email, password, DOB, phone, address, gender, role } = body;

      const userExist = await this.UserRepoService.findOne({ email });

      if (userExist) throw new ConflictException('Email already exist');

      const user = await this.UserRepoService.create({
        name,
        email,
        password,
        DOB,
        phone,
        address,
        gender,
        role,
      });

      const code = Math.floor(Math.random() * (99999 + 9)).toString();

      await this.OTPRepoService.createOTP({
        code,
        otpType: otpTypes.confirmation,
        userId: user._id,
      });

      await sendEmail({
        to: email,
        subject: 'Confirm Email',
        html: html({ code, message: 'Confirm Email Code' }),
      });

      return { user };
    } catch (error) {
      throw new InternalServerErrorException({
        error: error.message,
        stack: error.stack,
      });
    }
  }

  // ************************Confirm Email**************************
  async confirmEmail(body: ConfirmEmailDTO) {
    const { email, code } = body;

    const user = await this.UserRepoService.findOne({
      email,
      confirmed: { $exists: false },
    });

    if (!user)
      throw new NotFoundException('User not found or already confirmed');

    const otp = await this.OTPRepoService.otpExists({
      userId: user._id,
      otpType: otpTypes.confirmation,
      code,
    });

    await this.UserRepoService.findOneAndUpdate(
      { _id: user._id },
      { confirmed: true },
    );

    await this.OTPRepoService.findOneAndDelete({ _id: otp._id });

    return { message: 'done' };
  }

  // ************************Login**************************
  async login(body: loginDTO) {
    const { email, password } = body;

    const user = await this.UserRepoService.emailExists({
      email,
    });

    if (!Compare({ plainText: password, hashedText: user.password })) {
      throw new ForbiddenException('Incorrect password');
    }

    const access_token =
      user.role === UserRoles.admin
        ? this.TokenService.generateToken({
            payload: { email, id: user._id },
            options: {
              secret: process.env.SIGNATURE_ACCESS_ADMIN,
              expiresIn: '1d',
            },
          })
        : this.TokenService.generateToken({
            payload: { email, id: user._id },
            options: {
              secret: process.env.SIGNATURE_ACCESS_USER,
              expiresIn: '1d',
            },
          });

    const refresh_token =
      user.role === UserRoles.admin
        ? this.TokenService.generateToken({
            payload: { email, id: user._id },
            options: {
              secret: process.env.SIGNATURE_REFRESH_ADMIN,
              expiresIn: '1w',
            },
          })
        : this.TokenService.generateToken({
            payload: { email, id: user._id },
            options: {
              secret: process.env.SIGNATURE_REFRESH_USER,
              expiresIn: '1w',
            },
          });

    return { message: 'done', token: { access_token, refresh_token } };
  }

  // ************************Forget Password**************************
  async forgetPassword(body: forgetPasswordDTO) {
    const { email } = body;

    const user = await this.UserRepoService.emailExists({ email });

    // Create OTP code
    const code = Math.floor(Math.random() * (99999 + 9)).toString();

    await this.OTPRepoService.createOTP({
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      otpType: otpTypes.forgetPassword,
      userId: user._id,
    });

    await sendEmail({
      to: user.email,
      subject: 'Forget Password',
      html: html({ code, message: 'Forget Password Code' }),
    });

    return { message: 'done' };
  }

  // ************************Reset Password**************************
  async resetPassword(body: resetPasswordDTO) {
    const { email, password, code } = body;

    const user = await this.UserRepoService.emailExists({ email });

    const otp = await this.OTPRepoService.otpExists({
      code,
      userId: user._id,
      otpType: otpTypes.forgetPassword,
    });

    await this.UserRepoService.findOneAndUpdate(
      { _id: user._id },
      {
        password,
        passwordChangedAt: new Date(),
      },
    );

    await this.OTPRepoService.findOneAndDelete({ _id: otp._id });

    return { message: 'done' };
  }

  // ************************Update Password**************************
  async updatePassword(body: updatePasswordDTO, user: UserDocument) {
    const { oldPassword, password } = body;

    if (!Compare({ plainText: oldPassword, hashedText: user.password })) {
      throw new ForbiddenException('Incorrect password');
    }

    await this.UserRepoService.findOneAndUpdate(
      { _id: user._id },
      {
        password,
        passwordChangedAt: new Date(),
      },
    );

    return { user };
  }
}
