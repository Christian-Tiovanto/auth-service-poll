import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user';
import {
  Brackets,
  LessThan,
  MoreThanOrEqual,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { ErrorCode } from '@app/enums/error-code';
import { RegexPatterns } from '@app/enums/regex-pattern';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserSort } from '../classes/user.query';
import { SortOrder, SortOrderQueryBuilder } from '@app/enums/sort-order';
import { GetUserResponse } from '../classes/user.response';
import { SignupDto } from '@app/modules/auth/dtos/signup.dto';

interface GetAllUserQuery {
  pageNo: number;
  pageSize: number;
  sort?: UserSort;
  order?: SortOrder;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(signUpDto: SignupDto): Promise<User> {
    let createdUser: User;
    try {
      const user = this.userRepository.create(signUpDto);
      createdUser = await this.userRepository.save(user);
    } catch (err) {
      const queryError = err as QueryFailedError & {
        driverError: { code: ErrorCode; sqlMessage: string };
      };
      console.log(queryError.driverError.code);
      if (queryError.driverError.code == ErrorCode.DUPLICATE_ENTRY) {
        const duplicateValue = new RegExp(RegexPatterns.DuplicateEntry).exec(
          queryError.driverError.sqlMessage,
        );
        throw new ConflictException(`email value already exist`);
      }
    }
    delete createdUser.password;
    return createdUser;
  }

  async createUserAdmin(signUpDto: SignupDto): Promise<User> {
    let createdUser: User;
    try {
      const user = this.userRepository.create({ ...signUpDto, is_admin: true });
      createdUser = await this.userRepository.save(user);
    } catch (err) {
      const queryError = err as QueryFailedError & {
        driverError: { errno: ErrorCode; sqlMessage: string };
      };
      if (queryError.driverError.errno === ErrorCode.DUPLICATE_ENTRY) {
        const duplicateValue = new RegExp(RegexPatterns.DuplicateEntry).exec(
          queryError.driverError.sqlMessage,
        );
        throw new ConflictException(`${duplicateValue[1]} value already exist`);
      }
    }
    delete createdUser.password;
    return createdUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email, is_deleted: false },
      select: ['id', 'fullname', 'password'],
    });
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['user_role'],
    });
    return user;
  }

  async getAllUser({
    pageNo,
    pageSize,
    sort,
    order,
    startDate,
    endDate,
    search,
  }: GetAllUserQuery): Promise<[GetUserResponse[], number]> {
    const skip = (pageNo - 1) * pageSize;

    const sortBy: string = `user.${sort}`;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user_role', 'user_role')
      .skip(skip)
      .take(pageSize)
      .select(['user'])
      .andWhere('is_deleted = :isDeleted', { isDeleted: false })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user_role.role IS NULL').orWhere(
            'user_role.role != :superadminRole',
          );
        }),
      )
      .orderBy(sortBy, order.toUpperCase() as SortOrderQueryBuilder);

    //Conditionally add filters
    if (startDate) {
      queryBuilder.andWhere({ created_at: MoreThanOrEqual(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere({ created_at: LessThan(endDate) });
    }

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('email LIKE :search', { search: `%${search}%` }).orWhere(
            'fullname LIKE :search',
            { search: `%${search}%` },
          );
          // .orWhere('pin LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const [users, count] = await queryBuilder.getManyAndCount();
    const userResponse: GetUserResponse[] = users.map(
      (user: GetUserResponse) => {
        return {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          // pin: user.pin,
        };
      },
    );
    return [userResponse, count];
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!user) throw new NotFoundException('No user with that id');
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email, is_deleted: false },
      select: ['id', 'fullname', 'password'],
    });
    if (!user) throw new NotFoundException('No User with that Email');
    return user;
  }

  async updateUserPassword(
    userId: number,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.findUserById(userId);
    const isMatch = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Old Password is incorrect');
    }
    user.password = await bcrypt.hash(updatePasswordDto.password, 10);
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async updateUserById(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(userId);
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async deleteUserById(userId: number) {
    const user = await this.findUserById(userId);
    user.is_deleted = true;
    await this.userRepository.save(user);
  }
}
