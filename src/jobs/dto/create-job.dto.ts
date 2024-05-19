import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateJobDto {
  @IsNotEmpty({ message: 'Tên không được để trống !' })
  name: string;

  @IsNotEmpty({ message: 'Kỹ năng không được để trống !' })
  @IsArray({ message: 'Kỹ năng có định dạng là kiểu mảng!' })
  @IsString({ each: true, message: 'kỹ năng dịnh dạng là chuỗi!' })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: 'Vị trí không được để trống !' })
  location: string;

  @IsNotEmpty({ message: 'Mức lương không được để trống !' })
  salary: number;

  @IsNotEmpty({ message: 'Số lượng không được để trống !' })
  quantity: number;

  @IsNotEmpty({ message: 'Trình độ không được để trống !' })
  level: string;

  @IsNotEmpty({ message: 'Mô tả không được để trống !' })
  description: string;

  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống !' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Ngày bắt đầu là kiểu định dạng thời gian! (Date)' })
  startDate: Date;

  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống !' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Ngày kết thúc là kiểu định dạng thời gian! (Date)' })
  endDate: Date;

  @IsNotEmpty({ message: 'Trạng thái không được để trống !' })
  @IsBoolean({ message: 'Trạng thái có kiểu định dạng là boolean !' })
  isActive: boolean;
}
