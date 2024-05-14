import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({
      ...createCompanyDto,
      createBy: { _id: user._id, email: user.email },
    });
  }

  findAll() {
    return this.companyModel.find();
  }

  findOne(id: number) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found company !';
    return this.companyModel.findOne({ _id: id });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  async remove(id: number) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found company !';
    return await this.companyModel.softDelete({ _id: id });
  }
}
