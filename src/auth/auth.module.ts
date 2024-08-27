import { Module } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'

@Module({
  providers: [AuthGuard, JwtService, UsersService],
  exports: [AuthGuard],
})
export class AuthModule {}
