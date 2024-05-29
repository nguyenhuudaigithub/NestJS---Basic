import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { Resume, ResumeDocument } from './schemas/resume.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createUserCvDto;
    const { email, _id } = user;

    const newCV = await this.resumeModel.create({
      url,
      companyId,
      email,
      jobId,
      userId: _id,
      status: 'PENDING',
      createBy: {
        _id,
        email,
      },
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date(),
          updateBy: {
            _id,
            email,
          },
        },
      ],
    });

    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(`Không tìm thấy CV ! với ${_id}`);
    return this.resumeModel.findOne({ _id });
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(`Không tìm thấy CV ! với ${_id}`);

    const update = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updateBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );

    return update;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(`Không tìm thấy CV ! với ${_id}`);

    await this.resumeModel.updateOne(
      {
        _id,
      },
      {
        deletecBy: { _id: user._id, email: user.email },
      },
    );

    return this.resumeModel.softDelete({ _id });
  }

  async findByUsers(user: IUser) {
    return await this.resumeModel.find({
      userId: user._id,
    });
  }
}
