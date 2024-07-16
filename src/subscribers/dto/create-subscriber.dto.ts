import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Tên không được để trống !' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  @IsNotEmpty({ message: 'Email không được để trống !' })
  email: string;

  @IsNotEmpty({ message: 'Kỹ năng không được để trống !' })
  @IsArray({ message: 'Kỹ năng có định dạng là mảng!' })
  @IsString({ each: true, message: 'Kỹ năng định dạng là chuỗi ký tự!' })
  skills: string;
}
