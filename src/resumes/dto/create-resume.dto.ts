import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'Email không được để trống !' })
  email: string;

  @IsNotEmpty({ message: 'Id của người dùng không được để trống !' })
  userId: string;

  @IsNotEmpty({ message: 'Đường dẫn không được để trống !' })
  url: string;

  @IsNotEmpty({ message: 'Tình trạng không được để trống !' })
  status: string;

  @IsNotEmpty({ message: 'Id của công ty không được để trống !' })
  companyId: string;

  @IsNotEmpty({ message: 'Id của công việc không được để trống !' })
  jobId: string;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'Đường dẫn không được để trống !' })
  url: string;

  @IsNotEmpty({ message: 'Id của công ty không được để trống !' })
  @IsMongoId({ message: 'Id của công ty là một mongo id !' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Id của công việc không được để trống !' })
  @IsMongoId({ message: 'Id của công việc là một mongo id !' })
  jobId: mongoose.Schema.Types.ObjectId;
}
