import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async getMe(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.isDeleted) throw new NotFoundException('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.isDeleted) throw new NotFoundException('User not found');

    if (dto.email) {
      const email = dto.email.toLowerCase().trim();
      const existing = await this.usersRepo.findOne({ where: { email } });
      if (existing && existing.id !== userId) {
        throw new BadRequestException('Email already in use');
      }
      user.email = email;
    }

    if (dto.name) {
      user.name = dto.name.trim();
    }

    await this.usersRepo.save(user);

    return this.getMe(userId);
  }

  async softDeleteMe(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.isDeleted) {
      return { message: 'Account already deleted' };
    }

    user.isDeleted = true;

    // invalidate all tokens immediately
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;

    await this.usersRepo.save(user);

    return { message: 'Account soft-deleted' };
  }
}
