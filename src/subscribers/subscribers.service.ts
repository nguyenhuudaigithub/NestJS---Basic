import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from 'rxjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SubscriberDocument } from './schemas/subscriber.schemas';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private SubscribersModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { name, email, skills } = createSubscriberDto;
    const isExist = await this.SubscribersModel.findOne({ email });

    if (isExist) {
      throw new BadRequestException(
        `Email :  ${email} đã tồn tại trên hệ thống. Vui lòng kiểm tra lại email !`,
      );
    }

    let newSubs = await this.SubscribersModel.create({
      name,
      email,
      skills,
      createBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newSubs?._id,
      createBy: newSubs?.createBy,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.SubscribersModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.SubscribersModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Không tìm thấy công việc ! với ${id}`);
    return await this.SubscribersModel.findOne({ _id: id });
  }

  async update(UpdateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const updated = await this.SubscribersModel.updateOne(
      { email: user.email },
      {
        ...UpdateSubscriberDto,
        updateBy: { _id: user._id, email: user.email },
      },
      { upsert: true },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Không tìm thấy công việc ! với ${id}`);

    await this.SubscribersModel.updateOne(
      {
        _id: id,
      },
      {
        deletecBy: { _id: user._id, email: user.email },
      },
    );

    return this.SubscribersModel.softDelete({ _id: id });
  }

  async getSkills(user: IUser) {
    const { email } = user;
    return await this.SubscribersModel.findOne({ email }, { skills: 1 });
  }
}
