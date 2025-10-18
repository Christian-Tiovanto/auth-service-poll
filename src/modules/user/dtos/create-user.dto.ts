import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import { IUser } from '../models/user';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({ allowUnknown: false })
export class CreateUserDto
  implements Omit<IUser, 'id' | 'is_deleted' | 'user_role'>
{
  @ApiProperty({ example: 'test@gmail.com' })
  @JoiSchema(Joi.string().required())
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @JoiSchema(Joi.string().required())
  fullname: string;

  @ApiProperty({
    example: '123456',
    description: 'Password minimal 6 character and max 24 characters',
  })
  @JoiSchema(Joi.string().min(6).max(24).required())
  password: string;

  @ApiProperty({
    example: '123456',
    description: 'Password minimal 6 character and max 24 characters',
  })
  @JoiSchema(Joi.boolean().optional())
  is_admin: boolean;
}
