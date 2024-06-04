import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  gethashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const { name, email, password, age, gender, address, role } = createUserDto;
    const hashPassword = this.gethashPassword(password);
    const isExit = this.userModel.findOne({ email });

    if (isExit) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại !. Vui lòng sử dụng email khác.`,
      );
    }

    let newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      createBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select('-password')
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
      return 'Không tìm thấy người dùng !';

    return await this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate({
        path: 'role',
        select: { _id: 1, name: 1 },
      });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username }).populate({
      path: 'role',
      select: { name: 1, permissions: 1 },
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id))
      return 'Không tìm thấy người dùng !';

    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updateBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Không tìm thấy người dùng !';

    const foundUser = await this.userModel.findById({ id });

    if (foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException(
        'Không thể xóa tài khoản admin (admin@gmail.com) !',
      );
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletecBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return await this.userModel.softDelete({ _id: id });
  }

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password, age, gender, address } = registerUserDto;
    const hashPassword = this.gethashPassword(password);
    const isExit = await this.userModel.findOne({ email });

    if (isExit) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại !. Vui lòng sử dụng email khác.`,
      );
    }

    let newRegisterUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: 'USER',
    });
    return newRegisterUser;
  }

  updateUserTOken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      },
    );
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };
}
