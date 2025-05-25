import { Exclude, Expose, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';

class UserDto {
  @IsUUID()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  role: string;

  @IsBoolean()
  @Expose()
  isActive: boolean;

  @Exclude()
  passwordHash: string;

  @IsString()
  @Expose()
  firstName: string;

  @IsString()
  @Expose()
  lastName: string;

  @IsDate()
  @Expose()
  createdAt: Date;

  @IsDate()
  @Expose()
  updatedAt: Date;
}

export class AuthResponseDto {
  @IsString()
  @Expose()
  accessToken: string;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
