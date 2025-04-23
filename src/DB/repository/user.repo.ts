import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../models/index';
import { Model } from 'mongoose';
import { DatabaseRepo } from './Database.repo';

@Injectable()
export class UserRepoService extends DatabaseRepo<UserDocument> {
  constructor(
    @InjectModel('User')
    private readonly _UserModel: Model<UserDocument>,
  ) {
    super(_UserModel);
  }

  async emailExists({ email }: { email: string }) {
    const user = await this.findOne({
      email,
      confirmed: { $exists: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
