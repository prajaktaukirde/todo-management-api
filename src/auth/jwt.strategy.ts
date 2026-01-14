import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

type JwtPayload = {
  sub: string;
  tokenVersion: number;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),

    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepo.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('User deleted');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token expired');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
