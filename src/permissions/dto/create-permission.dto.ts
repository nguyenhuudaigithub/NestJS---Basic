import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Tên không được để trống !' })
  name: string;

  @IsNotEmpty({ message: 'Đường dẫn api không được để trống !' })
  apiPath: string;

  @IsNotEmpty({ message: 'Phương thức không được để trống !' })
  method: string;

  @IsNotEmpty({ message: 'Chức năng không được để trống !' })
  module: string;
}
