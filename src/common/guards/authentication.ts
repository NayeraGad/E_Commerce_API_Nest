import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../service/token.js';
import { UserRepoService } from '../../DB/repository/user.repo.js';
import { Request } from 'express';
import { TokenTypes } from '../types/types.js';

type AuthorizationType = {
  type: TokenTypes;
  token: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private TokenService: TokenService,
    private readonly UserRepoService: UserRepoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { type, token } = this.extractTokenFromHeader(request);

    try {
      const payload = await this.TokenService.verifyToken({
        token,
        options: {
          secret:
            type === TokenTypes.Bearer
              ? process.env.SIGNATURE_ACCESS_USER
              : process.env.SIGNATURE_ACCESS_ADMIN,
        },
      });

      const user = await this.UserRepoService.findOne({
        _id: payload.id,
        isDeleted: { $exists: false },
      });

      if (!user) throw new NotFoundException('User not found');

      request['user'] = user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): AuthorizationType {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!token || !type) throw new UnauthorizedException('Token not found');

    if (type !== TokenTypes.Admin && type !== TokenTypes.Bearer) {
      throw new UnauthorizedException('Invalid token prefix');
    }

    return { type: type as TokenTypes, token };
  }
}
