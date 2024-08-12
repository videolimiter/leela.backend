import { Injectable } from '@nestjs/common'
import { User } from 'prisma/generated/zod'
import { UserCreateDto } from './users/dto/users.dto'
import { UsersService } from './users/users.service'

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

  async register(data: UserCreateDto): Promise<User> {
    return this.usersService.create(data)
  }
}
