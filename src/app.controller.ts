import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { AppService } from './app.service'
import { LoginDto, SignUpDto } from './users/dto/users.dto'
import { JwtService } from '@nestjs/jwt'
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
  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt']
    const data = await this.jwtService.verifyAsync(cookie)
    return data
  }
}
