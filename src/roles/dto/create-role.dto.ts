import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Tên không được để trống !' })
  name: string;

  @IsNotEmpty({ message: 'Chi tiết không được để trống !' })
  description: string;

  @IsNotEmpty({ message: 'Trạng thái không được để trống !' })
  @IsBoolean({ message: 'Trạng thái có giá trị boolean' })
  isActive: boolean;

  @IsNotEmpty({ message: 'Quyền không được để trống !' })
  @IsMongoId({ each: true, message: 'Mỗi quyền là id của mongo' })
  @IsArray({ message: 'Quyền có định dạng là kiểu mảng' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
