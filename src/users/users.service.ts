import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { error } from 'console'
import { DatabaseService } from 'src/database/database.service'
@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createUserDto: Prisma.UserCreateInput) {
    const userWithSameEmail = await this.databaseService.user.findFirst({
      where: { email: createUserDto.email },
    })

    if (userWithSameEmail) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Этот email уже используется',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      )
    }
    return this.databaseService.user.create({ data: createUserDto })
  }
  async findAll() {
    return this.databaseService.user.findMany()
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    })
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
