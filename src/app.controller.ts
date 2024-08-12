import { Body, Controller, Post } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AppService } from './app.service'
import { password, SignUpDto } from './users/dto/users.dto'
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello()
  // }

  @Post('register')
  async register(@Body() signUpDto: SignUpDto) {
    const { password, ...rest } = signUpDto
    const hashedPassword = await bcrypt.hash(signUpDto.password, 12)
    return this.appService.register({ ...rest, hashedPassword })
  }
}
