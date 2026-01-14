import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(User) private readonly usersRepo: Repository<User>) {}

  async listUsers() {
    const users = await this.usersRepo.find({ order: { createdAt: 'DESC' } });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isDeleted: u.isDeleted,
      tokenVersion: u.tokenVersion,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }

  async updateUser(id: string, dto: AdminUpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email) {
      const email = dto.email.toLowerCase().trim();
      const existing = await this.usersRepo.findOne({ where: { email } });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Email already in use');
      }
      user.email = email;
    }

    if (dto.name !== undefined) user.name = dto.name.trim();
    if (dto.role !== undefined) user.role = dto.role;

    if (dto.isDeleted !== undefined) {
      user.isDeleted = dto.isDeleted;
      user.tokenVersion = (user.tokenVersion ?? 0) + 1; // invalidate tokens
    }

    await this.usersRepo.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isDeleted: user.isDeleted,
      updatedAt: user.updatedAt,
    };
  }

  async deleteUser(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.isDeleted) {
      user.isDeleted = true;
      user.tokenVersion = (user.tokenVersion ?? 0) + 1; // invalidate tokens
      await this.usersRepo.save(user);
    }

    return { message: 'User soft-deleted' };
  }
}
