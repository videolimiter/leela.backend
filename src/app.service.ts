import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { User } from 'prisma/generated/zod'
import { LoginDto, SignUpDto, UserCreateDto } from './users/dto/users.dto'
import { UsersService } from './users/users.service'
@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(signUpDto: SignUpDto): Promise<User> {
    const { password, ...rest } = signUpDto
    const hashedPassword = await bcrypt.hash(signUpDto.password, 12)
    return this.usersService.create({ ...rest, hashedPassword })
  }

  async login(data: LoginDto): Promise<string> {
    const user = await this.usersService.findOneByUsernameOrEmail(data)
    if (!user || (await bcrypt.compare(data.password, user.hashedPassword))) {
      throw new BadRequestException('invalid credentials')
    }

    const jwt = await this.jwtService.signAsync({ id: user.id })
    return jwt
  }
}
