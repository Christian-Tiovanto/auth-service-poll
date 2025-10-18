// src/seeder/user.seeder.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '@app/modules/user/models/user';
import { UserService } from '@app/modules/user/services/user.service';

@Injectable()
export class UserSeeder {
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
  ) {}

  async run() {
    const email: string = process.env.USER_EMAIL;
    const pass: string = process.env.USER_PASS;
    const existing = await this.userService.getUserByEmail(email);
    if (existing) {
      return;
    }

    return await this.dataSource.transaction(async (manager) => {
      // Use manager to get repository-scoped services
      const user = await manager.save(
        manager.create(User, {
          fullname: 'Admin',
          email: email,
          password: pass,
          is_admin: true,
        }),
      );

      return user;
    });
  }
}
