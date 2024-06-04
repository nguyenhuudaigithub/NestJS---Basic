import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống !' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng !' })
  @IsNotEmpty({ message: 'Email không được để trống !' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống !' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống !' })
  age: string;

  @IsNotEmpty({ message: 'Giới tính không được để trống !' })
  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống !' })
  address: string;

  @IsNotEmpty({ message: 'Chức vụ không được để trống !' })
  @IsMongoId({ message: 'Chức vụ có định dạng là id !' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống !' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng !' })
  @IsNotEmpty({ message: 'Email không được để trống !' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống !' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống !' })
  age: string;

  @IsNotEmpty({ message: 'Giới tính không được để trống !' })
  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống !' })
  address: string;
}
