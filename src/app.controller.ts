import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { AppService } from './app.service'
import { AuthGuard } from './auth/auth.guard'
import { LoginDto, SignUpDto, UserLoggedType } from './users/dto/users.dto'
@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello()
  // }

  @Post('register')
  async register(@Body() signUpDto: SignUpDto) {
    return this.appService.register(signUpDto)
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.appService.login(loginDto)
    response.cookie('jwt', jwt, {
      httpOnly: true,
    })
    return {
      message: 'login success',
    }
  }
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt')
    return {
      message: 'logout success',
    }
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async user(
    @Req()
    request: Request & { user: UserLoggedType },
  ) {
    return request.user
  }
}
