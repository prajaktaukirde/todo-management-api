import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwt: JwtService,
  ) {}

  private signToken(user: User) {
    return this.jwt.sign({
      sub: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });
  }

  async signup(dto: { name: string; email: string; password: string }) {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      name: dto.name.trim(),
      email,
      passwordHash,
      role: UserRole.USER,
      isDeleted: false,
      tokenVersion: 0,
    });

    await this.usersRepo.save(user);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async login(dto: { email: string; password: string }) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.isDeleted) throw new UnauthorizedException('User deleted');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return {
      accessToken: this.signToken(user),
    };
  }

  async logout(userId: string) {
    // increment tokenVersion -> all existing tokens instantly invalid
    await this.usersRepo.increment({ id: userId }, 'tokenVersion', 1);
    return { message: 'Logged out' };
  }
}
