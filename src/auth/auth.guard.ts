import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token = request.cookies['jwt']

    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token)
      request['user'] = decoded // Сохраняем информацию о пользователе в запросе
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
