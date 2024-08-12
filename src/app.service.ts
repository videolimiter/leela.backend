import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { User } from 'prisma/generated/zod'
import { LoginDto, UserCreateDto } from './users/dto/users.dto'
import { UsersService } from './users/users.service'
@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

  async register(data: UserCreateDto): Promise<User> {
    return this.usersService.create(data)
  }

  async login(data: LoginDto): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.usersService.findOneByUsernameOrEmail(data)
    if (!user || (await bcrypt.compare(data.password, user.hashedPassword))) {
      throw new BadRequestException('invalid credentials')
    }
    const { hashedPassword, ...rest } = user
    return rest
  }
}
