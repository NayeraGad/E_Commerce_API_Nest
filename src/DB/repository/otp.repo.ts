import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DatabaseRepo } from './Database.repo';
import { OTP, OTPDocument } from '../models/index';
import { Compare, otpTypes } from '../../common/index';

interface OTPOptions {
  code: string;
  expiresAt?: Date;
  otpType: otpTypes;
  userId: Types.ObjectId;
}

@Injectable()
export class OTPRepoService extends DatabaseRepo<OTPDocument> {
  constructor(
    @InjectModel(OTP.name)
    private readonly _OTPModel: Model<OTPDocument>,
  ) {
    super(_OTPModel);
  }

  async createOTP({ code, expiresAt, otpType, userId }: OTPOptions) {
    return this.create({
      code,
      expiresAt: expiresAt || new Date(Date.now() + 10 * 60 * 1000),
      otpType,
      userId,
    });
  }

  async otpExists({ userId, otpType, code }: OTPOptions) {
    const otp = await this.findOne({
      userId,
      otpType,
    });

    if (!otp) throw new NotFoundException('Code not found');

    if (!Compare({ plainText: code, hashedText: otp.code }))
      throw new ForbiddenException('Invalid code');

    if (new Date() > otp.expiresAt) {
      throw new BadRequestException('Code expired');
    }

    return otp;
  }
}
