import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Thêm mới CV thành công!')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage('Lấy ra danh sách CV thành công!')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Lấy ra CV thành công!')
  findOne(@Param('id') _id: string) {
    return this.resumesService.findOne(_id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhập trạng thái CV thành công!')
  updateStatus(
    @Param('id') _id: string,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(_id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa trạng thái CV thành công!')
  remove(@Param('id') _id: string, @User() user: IUser) {
    return this.resumesService.remove(_id, user);
  }

  @Post('by-user')
  @ResponseMessage('Lấy ra CV thành công!')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.findByUsers(user);
  }
}
