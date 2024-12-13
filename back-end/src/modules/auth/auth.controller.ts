import { Cookies } from '@/decorators/cookie';
import { ResponseMessage } from '@/decorators/message';
import { Public } from '@/decorators/public';
import { DUser } from '@/decorators/user';
import { AuthService } from '@/modules/auth/auth.service';
import { LocalAuthGuard } from '@/modules/auth/local-auth.guard';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Public()
  @UseGuards(LocalAuthGuard)
  async signin(@DUser() user: UserByAccessToken, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(user, res);
  }

  @Post('signout')
  @ResponseMessage('Đăng xuất thành công')
  signout(@DUser() user: UserByAccessToken, @Res({ passthrough: true }) res: Response) {
    return this.authService.signout(res, user);
  }

  @Post('refresh')
  @Public()
  async refreshToken(@Cookies('refresh_token') refreshToken: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.createAccessTokenByRefreshToken(refreshToken, res);
  }

  @Post('signup')
  @Public()
  async signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }

  @Get('profile')
  @ResponseMessage('Lấy thông tin người dùng thành công')
  getProfile(@DUser() user: UserByAccessToken) {
    return this.authService.getProfile(user);
  }
}
