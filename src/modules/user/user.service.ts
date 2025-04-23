import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OTPRepoService, UserRepoService } from '../../DB/repository/index';
import { ConfirmEmailDTO, loginDTO, SignUpDTO } from './userDTO/customUser.dto';
import {
  Compare,
  html,
  otpTypes,
  sendEmail,
  TokenService,
  UserRoles,
} from '../../common/index.js';

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

  // ************************confirmEmail**************************
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

    if (new Date() > otp.expiresAt) {
      throw new BadRequestException('Code expired');
    }

    await this.UserRepoService.findOneAndUpdate(
      { _id: user._id },
      { confirmed: true },
    );

    await this.OTPRepoService.findOneAndDelete({ _id: otp._id });

    return { message: 'done' };
  }

  // ************************login**************************
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
}
