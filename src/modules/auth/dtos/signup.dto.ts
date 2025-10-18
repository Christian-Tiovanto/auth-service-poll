import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '@app/modules/user/models/user';

@JoiSchemaOptions({ allowUnknown: false })
export class SignupDto
  implements Omit<IUser, 'id' | 'is_deleted' | 'is_admin'>
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
}
