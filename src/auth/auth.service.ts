import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { genSaltSync, hashSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);

      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    const refreshToken = this.createRefreshToken(payload);

    // update refresh token
    await this.usersService.updateUserTOken(refreshToken, _id);

    //set refresh token as cookies
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      refreshToken,
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  gethashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async register(registerUserDto: RegisterUserDto) {
    let newUser = await this.usersService.register(registerUserDto);
    return {
      id: newUser?._id,
      createAt: newUser?.createdAt,
    };
  }

  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refreshToken;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        //update refresh token
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };

        const refreshToken = this.createRefreshToken(payload);

        // update refresh token
        await this.usersService.updateUserTOken(refreshToken, _id.toString());

        response.clearCookie('refresh_token');
        //set refresh token as cookies
        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          refreshToken,
          user: {
            _id,
            name,
            email,
            role,
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh token không hợp lệ. Vui lòng đăng nhập lại !',
        );
      }
    } catch (err) {
      throw new BadRequestException(
        'Refresh token không hợp lệ. Vui lòng đăng nhập lại !',
      );
    }
  };
}
