import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UserService } from '@/modules/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser = async (username: string, pass: string): Promise<any> => {
    const { password, ...user } = await this.userService.findOneByEmail(username);
    if (user && this.userService.comparePassword(pass, password)) {
      return user;
    }
    return null;
  };

  signin = async (user: UserByAccessToken, res: Response) => {
    const payload = user;

    const refreshToken = await this.createRefreshToken(payload);

    this.userService.updateRefreshToken(user.id, refreshToken);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(process.env.REFRESH_TOKEN_EXPIRE),
    });

    return {
      access_token: this.jwtService.sign(payload),
    };
  };

  signup = async (createUserDto: CreateUserDto) => {
    return await this.userService.create(createUserDto);
  };

  signout = async (res: Response, user: UserByAccessToken) => {
    res.clearCookie('refresh_token');
    this.userService.removeRefreshToken(user.id);
  };

  createRefreshToken = async (payload: UserByAccessToken) => {
    return this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
  };

  createAccessTokenByRefreshToken = async (refreshToken: string, res: Response): Promise<{ access_token: string }> => {
    const user: UserByAccessToken & { iat: string; exp: string } = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      })
      .catch(() => undefined);

    if (!user) {
      throw new BadRequestException('Refresh token không hợp lệ');
    }
    const { iat, exp, ...payload } = user;

    if (!payload || !(await this.userService.findOneByRefreshToken(refreshToken))) {
      throw new BadRequestException('Refresh token không hợp lệ');
    }

    return this.signin(payload, res);
  };

  getProfile = async (user: UserByAccessToken) => {
    return this.userService.findOne(user.id);
  };
}
