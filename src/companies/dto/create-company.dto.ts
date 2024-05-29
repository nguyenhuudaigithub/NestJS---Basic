import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Tên công ty không được để trống !' })
  name: string;

  @IsNotEmpty({ message: 'Địa chỉ công ty không được để trống !' })
  address: string;

  @IsNotEmpty({ message: 'Chi tiết không được để trống !' })
  description: string;

  @IsNotEmpty({ message: 'Ảnh đại diện không được để trống !' })
  Logo: string;
}
