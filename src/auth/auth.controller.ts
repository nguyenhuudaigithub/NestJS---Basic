import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Đăng nhập thành công !')
  @Post('/login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Get('profile')
  @ResponseMessage('Thông tin cá nhân !')
  getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  @ResponseMessage('Đăng ký thành công tài khoản mới !')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('/account')
  @ResponseMessage('Lấy thông tin người dùng thành công !')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage('Lấy thông tin người dùng bằng refresh token thành công !')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('/logout')
  @ResponseMessage('Đăng xuất thành công !')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
