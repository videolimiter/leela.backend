import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { error } from 'console'
import { DatabaseService } from 'src/database/database.service'
import { Login, LoginDto } from './dto/users.dto'
import { BasicUserSelect } from './dto/users.select'
@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createUserDto: Prisma.UserCreateInput) {
    const userWithSameUsernameOrEmail =
      await this.databaseService.user.findFirst({
        where: {
          OR: [
            { username: createUserDto.username },
            { email: createUserDto.email },
          ],
        },
      })

    if (userWithSameUsernameOrEmail) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Этот email или имя уже занято',
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

  async findOneById(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
      select: BasicUserSelect,
    })
  }

  async findOneByUsername(username: string) {
    return this.databaseService.user.findUnique({ where: { username } })
  }
  async findOneByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } })
  }

  async findOneByUsernameOrEmail(data: LoginDto) {
    const { email, password, username } = Login.parse({
      ...data,
    })
    return this.databaseService.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    })
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
