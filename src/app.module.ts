import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './modules/user/models/user';
import { UserModule } from './modules/user/user.module';
import { DataValidationPipe } from './pipes/validation.pipe';
import { ExceptionHandlerFilter } from './filters/exception-handler.filter';
import { UserSeeder } from './seeder/user.seeder';
import { SecurityPinSeeder } from './seeder/security-pin.seeder';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    { provide: APP_PIPE, useClass: DataValidationPipe },
    { provide: APP_FILTER, useClass: ExceptionHandlerFilter },
    UserSeeder,
    SecurityPinSeeder,
  ],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
      logger: 'advanced-console',
    }),
    UserModule,
  ],
})
export class AppModule {}
